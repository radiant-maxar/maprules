const authenticate = require('../../jwtScheme').authenticate;
const db = require('../../connection');
const config = require('../../config')[process.env.NODE_ENV || 'development'];
const osm = config.osmSite;
const consumerKey = config.consumerKey;
const consumerSecret = config.consumerSecret;
const sessionsManager = require('../../sessionsManager');
const requestPromise = require('../../requestPromise');
const qs = require('qs');
const parseXML = require('xml2js').parseString;
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const callbackUrl = config.callbackUrl;

module.exports = {
    callback: {
        method: 'GET',
        path: '/auth/callback',
        config: {
            pre: [
                {
                    assign: 'callbackValidation',
                    /**
                     * Called before handler, this validation pre method...
                     *  1. makes sure needed query parameters are present,
                     *  2. retrieves the oauth_token query param's partner oauth_token_secret first generated by `request_token`
                     *  3. returns the tokens and session id needed by the callback route's handler function
                     *
                     * ... if the token/verifier query parameters are not preset or it cannot find the partner oauth_token_secret, it returns an error.
                     */
                    method: function(r, h) { // gets called before handler...
                        let oauthToken = r.query.oauth_token;

                        if (!oauthToken || !oauthToken.length) {
                            throw err;
                        }

                        let oauthVerifier = r.query.oauth_verifier;

                        if (!oauthToken || !oauthToken.length) {
                            throw err;
                        }

                        let oauthTokenSecret, userAgent, sessionId;

                        for (let i = 0; i < sessionsManager.all().length; i++) {
                            sessionId = sessionsManager.get(i);
                            let session = r.yar.get(sessionId);

                            if (!session) {
                                sessionsManager.remove(sessionId);
                                throw new Error('unknown session!!!');
                            }


                            if (!session.oauth_token === oauthToken && session.user_agent !== r.headers['user-agent']) {
                                continue;
                            }

                            oauthTokenSecret = session.oauth_token_secret;
                            userAgent = session.user_agent;
                            break;
                        }

                        if (!oauthTokenSecret) {
                            throw new Error('unknown session!!!');
                        }

                        return {
                            oauthToken: oauthToken,
                            oauthVerifier: oauthVerifier,
                            oauthTokenSecret: oauthTokenSecret,
                            sessionId: sessionId,
                            userAgent: userAgent
                        };

                    }
                }
            ],
            handler: function(r, h) {
                let { oauthToken, oauthVerifier, oauthTokenSecret, sessionId, userAgent } = r.pre.callbackValidation;

                const accessTokenConfig = {
                    url: `${osm}/oauth/access_token`,
                    method: 'POST',
                    oauth: {
                        consumer_key: consumerKey,
                        consumer_secret: consumerSecret,
                        token: oauthToken,
                        token_secret: oauthTokenSecret,
                        verifier: oauthVerifier
                    }
                };

                // make request to request_token
                return requestPromise(accessTokenConfig)
                    .then(function(body) {
                        // try to parse the response
                        let tokenResponse;
                        try {
                            tokenResponse = qs.parse(body);
                        } catch (error) {
                            console.log(err);
                            throw err;
                        }

                        // now we can go get the user details....
                        let userDetailsConfig = {
                            url: `${osm}/api/0.6/user/details`,
                            method: 'GET',
                            oauth: {
                                consumer_key: consumerKey,
                                consumer_secret: consumerSecret,
                                token: tokenResponse.oauth_token,
                                token_secret: tokenResponse.oauth_token_secret
                            },
                            headers: {
                                'content-type': 'text/xml'
                            }
                        };

                        return requestPromise(userDetailsConfig)
                            .then(function(body) {
                                return new Promise(function(resolve, reject) {
                                    parseXML(body, function(error, result) {
                                        if (error) {
                                            reject();
                                        } else {
                                            resolve(result);
                                        }
                                    });
                                });
                            })
                            .then(async function(userDetails) {
                                let details = {
                                    id: userDetails.osm.user[0]['$'].id,
                                    name: userDetails.osm.user[0]['$'].display_name
                                };

                                try {

                                    let user = await db('users').where('id', details.id);
                                    let decodedJWT = {
                                        id: details.id,
                                        name: details.name,
                                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8)
                                    };

                                    if (!user.length) { // if new user, insert into db and make new session jwt
                                        await db('users').insert(details);
                                        decodedJWT.session = uuid();
                                        await db('user_sessions').insert({
                                            id: decodedJWT.session,
                                            user_id: details.id,
                                            user_agent: userAgent,
                                            created_at: new Date()
                                        });
                                    } else { // logged in user.
                                        decodedJWT.session = uuid();
                                        let whereAgentUser = {
                                            user_id: details.id,
                                            user_agent: userAgent
                                        };
                                        let session = await db('user_sessions').where(whereAgentUser);
                                        if (session.length) { // if logging in from new client, make new session record
                                            await db('user_sessions')
                                                .where(whereAgentUser)
                                                .update({
                                                    id: decodedJWT.session,
                                                    created_at: new Date()
                                                });
                                        } else { // update existing user-client record with new session id
                                            await db('user_sessions')
                                                .insert({
                                                    id: decodedJWT.session,
                                                    user_id: details.id,
                                                    user_agent: userAgent,
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
                    .then(function(decodedJWT) {
                        sessionsManager.remove(sessionId);
                        r.yar.clear(sessionId);

                        const signedToken = jwt.sign(decodedJWT, config.jwt);
                        return h.response(signedToken).code(200);
                    })
                    .catch(function(err) {
                        sessionsManager.remove(sessionId);
                        r.yar.clear(sessionId);

                        throw err;
                    });
            }
        }
    },
    login: {
        method: 'GET',
        path: '/auth/login',
        config: {
            handler: function(r, h) {
                if (!config.jwt.length) throw error;

                const requestTokenConfig = {
                    url: `${osm}/oauth/request_token`,
                    method: 'POST',
                    oauth: {
                        callback: callbackUrl,
                        consumer_key: consumerKey,
                        consumer_secret: consumerSecret
                    }
                };

                return requestPromise(requestTokenConfig)
                    .then(function(body) {
                        let tokenResponse;
                        try {
                            tokenResponse = qs.parse(body);
                        } catch (err) {
                            throw err;
                        }

                        // create record ofo new session in sessions list so we can track response when
                        // logged in user comes back to callback_url
                        const sessionId = uuid();
                        sessionsManager.add(sessionId);

                        // save the session in our session manager...
                        r.yar.set(sessionId, {
                            oauth_token: tokenResponse.oauth_token,
                            oauth_token_secret: tokenResponse.oauth_token_secret,
                            user_agent: r.headers['user-agent']
                        });

                        return h
                            .response(`${osm}/oauth/authorize?oauth_token=${tokenResponse.oauth_token}`)
                            .code(200)
                            .header('Content-Type', 'text')
                            .header('X-Content-Type-Options', 'nosniff');

                    })
                    .catch(function(error) {
                        console.log(error);
                        throw error;
                    });
            }
        }
    },
    logout: authenticate({
        method: 'POST',
        path: '/auth/logout',
        config: {
            handler: function(r, h) {
                let token = r.auth.credentials;
                let userAgent = r.headers['user-agent'];
                let sessionWhere = {
                    user_id: token.id,
                    user_agent: userAgent,
                    id: token.session
                };

                return db('user_sessions')
                    .where(sessionWhere)
                    .delete()
                    .then(function(r) {
                        return h
                            .response('logged out')
                            .code(200)
                            .header('Content-Type', 'text')
                            .header('X-Content-Type-Options', 'nosniff');
                    })
                    .catch(function(e) {
                        throw e;
                    });
            }
        }
    }),
    /**
     * the jwt strategy will capture fail cases and return 401.
     * we will only ever get the the handler function if the provided jwt is considered valid.
     */
    session: authenticate({
        method: 'GET',
        path: '/auth/session',
        handler: function(r, h) {
            return h
                .response('authenticated')
                .code(200)
                .header('Content-Type', 'text')
                .header('X-Content-Type-Options', 'nosniff');
        }
    })
};
