'use strict';

const config = require('./config')[process.env.NODE_ENV || 'development'];
const db = require('./connection');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

/**
 * true when token is no longer valid.
 * @param {Date} timestamp timestamp when session token was created
 */
function outOfDate(timestamp) {
    return dayjs(Date.now()).diff(timestamp, 'hours') > 8;
}

/**
 * Decodes JSON Web Token from its encrypted version provided by HTTP request
 * @param {string} authorizationHeader HTTP authorization header that includes JWT
 * @return {object} parsed JWT that includes session id, user id, and user name
 */
// function getToken(authorizationHeader) {

// }

/**
 * Ensures JWT provided in authorization header is valid
 * @param {object} headers object holding http request headers
 * @return {boolean} true when correct header is present, represents currently valid JWT, and user that exists in DB
 */
function isAuthorized(token, userAgent) {
    return db('user_sessions')
        .where({ id: token.session, user_id: token.id })
        .then(function(sessions) {
            if (!sessions.length) {
                throw new Error('token invalid, session unknown');
            }

            let session = sessions[0];

            // consider out of date token 'unauthorized'
            // also, make sure to delete it...
            if (outOfDate(session.created_at)) {
                return db('user_sessions')
                    .where('id', 'token.session')
                    .delete()
                    .then(function() {
                        throw new Error('token invalid, session expired');
                    });
            }

            if (session.user_agent !== userAgent) {
                throw new Error('token invalid');
            }

            // also, token for user that does not exist isn't
            // considered authorized...
            return db('users')
                .where('id', token.id)
                .then(function(user) {
                    if (!user.length) {
                        throw new Error('token invalid, ses');
                    }
                    return token;
                });

        }).catch(function(e) {
            throw new Error(e.message);
        });
}

function jwtAuthentication(request, h) {
    return Promise.resolve(request.state.maprules_session)
        .then(function(cookie) {
            if (!cookie || !cookie.length) {
                throw new Error('no token provided');
            }

            let token;
            try {
                token = jwt.verify(cookie, config.jwt);
            } catch (error) {
                throw new Error('invalid token provided');
            }

            return isAuthorized(token, request.headers['user-agent']);
        })
        .then(function(token) {
            return h.authenticated({ credentials: token });
        })
        .catch(function(error) {
            return Boom.unauthorized(error.message, 'Bearer');
        });
}

/**
 * scheme used for jwt authentication strategy...
 */
function scheme(server, options) {
    return {
        api: { settings: 5 },
        authenticate: jwtAuthentication
    };
}

/**
 * Super small helper function to make route authenticate with JWT
 * @param {*} route
 */
function authenticate(route) {
    route.config = Object.assign(route.config || {}, { auth: 'default' });
    return route;
}

module.exports = {
    scheme: scheme,
    authenticate: authenticate,
    isAuthorized: isAuthorized
};
