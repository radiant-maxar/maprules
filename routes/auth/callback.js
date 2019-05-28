const config = require('../../config')[process.env.NODE_ENV || 'development'];
const osm = config.osmSite;
const consumerKey = config.consumerKey;
const consumerSecret = config.consumerSecret;
const sessionsManager = require('../../sessionsManager');
const requestPromise = require('../../requestPromise');
const qs = require('qs');
const parseXML = require('xml2js').parseString;
const db = require('../../connection');
const uuid = require('uuid/v4');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

module.exports = {
    method: 'GET',
    path: '/auth/callback',
    config: {
        handler: function (r, h) {
            // make sure provided oauth_token is within our session manager...
            let requestOAuthToken = r.query.oauth_token;
            let sessionOAuthToken;

            let sessions = sessionsManager.all();
            let session;
            let sessionId;

            for (let i = 0; i < sessions.length; i++) {
                sessionId = sessions[i];
                session = r.yar.get(sessionId);

                if (!session) {
                    sessions.remove(sessionId);
                    throw new Error('unknown session!!!');
                    return;
                }
                if (!session.oauth_token === requestOAuthToken) {
                    continue;
                }
                sessionOAuthToken = session.oauth_token;
            }

            if (!sessionOAuthToken) {
                throw new Error('unknown session!!!');
                return;
            }

            // once we know this is a valid token, go get access_token...
            const accessTokenConfig = {
                url: `${osm}/oauth/access_token`,
                method: 'POST',
                oauth: {
                    consumer_key: consumerKey,
                    consumer_secret: consumerSecret,
                    token: sessionOAuthToken,
                    token_secret: session.oauth_token_secret,
                    verifier: r.query.oauth_verifier
                }
            };


            // make request to request_token
            return requestPromise(accessTokenConfig)
                .then(function (body) {
                    // try to parse the response
                    let tokenResponse;
                    try {
                        tokenResponse = qs.parse(body);
                    } catch (error) {
                        console.log(err);
                        throw err;
                    }

                    // now we can go get the user details....
                    let accessToken = tokenResponse.oauth_token;
                    let accessTokenSecret = tokenResponse.oauth_token_secret;

                    let userDetailsConfig = {
                        url: `${osm}/api/0.6/user/details`,
                        method: 'GET',
                        oauth: {
                            consumer_key: consumerKey,
                            consumer_secret: consumerSecret,
                            token: accessToken,
                            token_secret: accessTokenSecret
                        },
                        headers: {
                            'content-type': 'text/xml'
                        }
                    }

                    return requestPromise(userDetailsConfig)
                        .then(function (body) {
                            sessionsManager.remove(sessionId);
                            r.yar.clear(sessionId);

                            return new Promise(function (resolve, reject) {
                                parseXML(body, function (error, result) {
                                    if (error) {
                                        reject();
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });
                        })
                        .then(async function (userDetails) {
                            let details = {
                                id: userDetails.osm.user[0]['$'].id,
                                name: userDetails.osm.user[0]['$'].display_name
                            };

                            try {

                                let user = await db('users').where('id', details.id);
                                let sessionId;
                                let decodedJWT = {
                                    id: details.id,
                                    name: details.name
                                };

                                if (!user.length) { // if new user, insert into db and make new session jwt
                                    await db('users').insert(details);
                                    decodedJWT.session = uuid();
                                    await db('user_sessions').insert({
                                        id: decodedJWT.session,
                                        user_id: details.id,
                                        created_at: new Date()
                                    });
                                    // sessionHash = 'generated';
                                } else { // if old, then see if session is old, and make new one if needed...
                                    let session = await db('user_sessions').where('user_id', details.id);
                                    if (session.length) {
                                        if (dayjs(session.createdAt).diff(dayjs(Date.now()), 'hours') > 8) {
                                            decodedJWT.session = uuid();
                                            await db('user_sessions').insert('id', decodedJWT.session);
                                        } else {
                                            decodedJWT.session = session.id;
                                        }
                                    } else {
                                        decodedJWT.session = uuid();
                                        await db('user_sessions').insert({
                                            id: decodedJWT.session,
                                            user_id: details.id,
                                            created_at: new Date()
                                        });
                                    }
                                }

                                return decodedJWT;
                            } catch (error) {
                                throw error;
                            }
                        });
                })
                .then(function (decodedJWT) {
                    const signedToken = jwt.sign(decodedJWT, config.jwt);
                    return h.response(signedToken).code(200);
                })
                .catch(function (err) {
                    throw err;
                });
        }
        // validate: { params: { id: uuidSchema } }
    }
};