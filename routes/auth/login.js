const config = require('../../config')[process.env.NODE_ENV || 'development'];

const sessionsManager = require('../../sessionsManager');
const requestPromise = require('../../requestPromise');


const uuid = require('uuid/v4');
const osm = config.osmSite;
const consumerKey = config.consumerKey;
const consumerSecret = config.consumerSecret;
const callbackUrl = config.callbackUrl;
const qs = require('qs');

const requestTokenConfig = {
    url: `${osm}/oauth/request_token`,
    method: 'POST',
    oauth: {
        callback: callbackUrl,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret
    }
};

module.exports = {
    method: 'GET',
    path: '/auth/login',
    config: {
        handler: function (r, h) {
            if (!config.jwt.length) throw error;
            return requestPromise(requestTokenConfig)
                .then(function (body) {
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
                        oauth_token_secret: tokenResponse.oauth_token_secret
                    });

                    return h
                        .response(`${osm}/oauth/authorize?oauth_token=${tokenResponse.oauth_token}`)
                        .code(200)
                        .header('Content-Type', 'text')
                        .header('X-Content-Type-Options', 'nosniff');

                })
                .catch(function (error) {
                    console.log(error);
                    throw new Error('BAD');
                });
        }
        // validate: { params: { id: uuidSchema } }
    }
};