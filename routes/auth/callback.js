const config = require('../../config')[process.env.NODE_ENV || 'development'];
const osm = config.osmSite;
const consumerKey = config.consumerKey;
const consumerSecret = config.consumerSecret;
const callbackUrl = config.callbackUrl;
const sessionsManager = require('../../sessionsManager');
const requestPromise = require('../../requestPromise');
const qs = require('qs');



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
                            console.log(body);
                        })

                })
                .then(function () {
                    return h.response({ you_are: 'loggedIn' }).code(200);
                })
                .catch(function (error) {
                    throw err;
                });
        }
        // validate: { params: { id: uuidSchema } }
    }
};