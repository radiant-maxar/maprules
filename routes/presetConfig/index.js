'use strict';

const config = require('../../config')[process.env.NODE_ENV || 'development'];

const uuidSchema = require('../../schemas/components').uuid;
const presetConfigSchema = require('../../schemas/presetConfig');

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const db = require('../../connection');
const ensureExtant = require('../../handlers/helpers').ensureExtant;

const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const uuid4 = require('uuid/v4');

/**
 * true when token is no longer valid.
 * @param {Date} timestamp timestamp when session token was created
 */
function outOfDate(timestamp) {
    return dayjs(timestamp).diff(Date.now(), 'hours') > 8;
}

/**
 * Makes sure session id exists and is not 'out of date', as well as sees that token user exists in DB
 * @param {object} token JSON Web token
 * @return {boolean} true when both user and session id are valid.
 */
async function canModify(token) {
    let session = await db('user_sessions').where('id', token.session);
    if (!session.length) {
        throw err;
    }

    if (outOfDate(session[0].created_at)) { // remove expired session record...
        await db('user_sessions').delete().where({ id: token.session, user_id: token.user_id });
        throw err;
    }

    let user = await db('users').where('id', token.id);
    if (!user.length) {
        throw err;
    }
    return;
}

/**
 * Decodes JSON Web Token from its encrypted version provided by HTTP request
 * @param {string} authorizationHeader HTTP authorization header that includes JWT
 * @return {object} parsed JWT that includes session id, user id, and user name
 */
function getToken(authorizationHeader) {
    return jwt.verify(authorizationHeader.replace('Bearer ', ''), config.jwt);
}

/**
 * Ensures JWT provided in authorization header is valid
 * @param {object} headers object holding http request headers
 * @return {boolean} true when correct header is present, represents currently valid JWT, and user that exists in DB
 */
async function JWTValidation(headers) {
    let authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
        throw err;
    }

    let token = getToken(authorizationHeader);
    await canModify(token);
    return;
}


module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}',
        config: {
            handler: async function(r, h) {
                try {
                    const uuid = r.params.id;
                    await ensureExtant(uuid);

                    const query = await db.select('preset').from('presets').where({id: uuid});
                    const config = JSON.parse(query[0].preset);
                    return h.response(config).code(200);
                } catch (error) {
                    return error;

                }
            },
            validate: { params: { id: uuidSchema } },
            response: { schema: presetConfigSchema }
        }
    },
    put: {
        method: 'PUT',
        path: '/config/{id}',
        config: {
            handler: async function (r, h) {
                try {
                    const id = r.params.id;
                    await ensureExtant(id);

                    const presets = r.payload;

                    await db.raw(`UPDATE presets SET preset = json('${JSON.stringify(presets)}') WHERE id = '${id}'`);
                    return h.response({ update: 'successful' }).code(200);

                } catch (error) {
                    return error;
                }

            },
            validate: {
                headers: JWTValidation,
                payload: presetConfigSchema,
                params: { id: uuidSchema },
                failAction: async (request, h, err) => err
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] }
        }
    },
    post: {
        method: 'POST',
        path: '/config',
        config: {
            handler: async function(r, h) {
                try {
                    const token = getToken(r.headers.authorization);
                    const presets = r.payload;
                    const uuid = uuid4();

                    await db('presets').insert({
                        id: uuid,
                        preset: JSON.stringify(presets),
                        user_id: token.id
                    });
                    return h.response({ upload: 'successful', id: uuid }).code(200);
                } catch (error) {
                    return Boom.badImplementation(error.message);
                }
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
            validate: {
                headers: JWTValidation,
                payload: presetConfigSchema,
                failAction: async (request, h, err) => err
            }
        }
    }
};