'use strict';

const config = require('../../config')[process.env.NODE_ENV || 'development'];
const db = require('../../connection');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

/**
 * true when token is no longer valid.
 * @param {Date} timestamp timestamp when session token was created
 */
function outOfDate(timestamp) {
    return dayjs(timestamp).diff(Date.now(), 'hours') > 8;
}

/**
 * Decodes JSON Web Token from its encrypted version provided by HTTP request
 * @param {string} authorizationHeader HTTP authorization header that includes JWT
 * @return {object} parsed JWT that includes session id, user id, and user name
 */
function getToken(authorizationHeader) {
    return authorizationHeader.length
        ? jwt.verify(authorizationHeader.replace('Bearer ', ''), config.jwt)
        : authorizationHeader;
}

/**
 * Ensures JWT provided in authorization header is valid
 * @param {object} headers object holding http request headers
 * @return {boolean} true when correct header is present, represents currently valid JWT, and user that exists in DB
 */
function isAuthorized(token) {
    return db('user_sessions')
        .where('id', token.session)
        .then(function (session) {
            if (!session.length) {
                return false;
            }

            // consider out of date token 'unauthorized'
            // also, make sure to delete it...
            if (outOfDate(session[0].created_at)) {
                return db('user_sessions')
                    .where('id', 'token.session')
                    .delete()
                    .then(function () {
                        return false;
                    });
            }

            // also, token for user that does not exist isn't
            // considered authorized...
            return db('users')
                .where('id', token.id)
                .then(function (user) {
                    return user.length > 0;
                });

        }).catch(function (e) {
            console.log(e);
            return false;
        });
}

async function jwtAuthentication(request, h) {
    try {
        let token = getToken(request.headers.authorization);
        if (!token.length) {
            throw Boom.unauthorized(null, 'Custom');
        }

        let authorized = await isAuthorized(token);
        if (!authorized) {
            throw Boom.unauthorized(null, 'Custom');
        }

        return h.authenticated({ credentials: token });
    } catch (error) {
        throw Boom.unauthorized(null, 'Custom');
    }
}

export function scheme(server, options) {
    return {
        api: { settings: 5 },
        authenticate: jwtAuthentication
    };
}