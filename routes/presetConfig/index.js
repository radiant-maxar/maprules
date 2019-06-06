'use strict';

const uuidSchema = require('../../schemas/components').uuid;
const presetConfigSchema = require('../../schemas/presetConfig');
const Boom = require('@hapi/boom');
const db = require('../../connection');
const uuid4 = require('uuid/v4');
const authenticate = require('../../jwtScheme').authenticate;

const presetExists = require('../helpers').presetExists;

/**
 * All handlers wrap knex promises in a try catch.
 * That try catch is meant to capture any errors not related to the database interaction
 *
 * All database error handling uses classic then/catch error handling...
 */
module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}',
        config: {
            auth: false,
            handler: function (r, h) {
                try {
                    const { id } = r.params;

                    return presetExists(id)
                        .then(function (results) {
                            const config = JSON.parse(results[0].preset);
                            return h.response(config).code(200);
                        })
                        .catch(function (error) {
                            return Boom.notFound(error.message);
                        });
                } catch (error) {
                    return Boom.badImplementation(error);
                }
            },
            validate: { params: { id: uuidSchema } },
            response: { schema: presetConfigSchema }
        }
    },
    put: authenticate({
        method: 'PUT',
        path: '/config/{id}',
        config: {
            handler: function (r, h) {
                try {
                    const token = r.auth.credentials;
                    const id = r.params.id;
                    const preset = JSON.stringify(r.payload);

                    return presetExists(id, token.id)
                        .then(function () { // check first that to update exists, then update, otherwise throw 404 to user.
                            return db('presets')
                                .where({ id: id, user_id: token.id })
                                .update('preset', preset);
                        })
                        .then(function(r) {
                            return h.response({ update: 'successful' }).code(200);
                        })
                        .catch(function (error) {
                            return Boom.notFound(error.message);
                        });
                } catch (error) {
                    return Boom.badImplementation(error);
                }
            },
            validate: {
                payload: presetConfigSchema,
                params: { id: uuidSchema },
                failAction: async (request, h, err) => err
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] }
        }
    }),
    post: authenticate({
        method: 'POST',
        path: '/config',
        config: {
            handler: function (r, h) {
                try {
                    const token = r.auth.credentials;
                    const presets = r.payload;
                    const uuid = uuid4();

                    return db('presets')
                        .insert({
                            id: uuid,
                            preset: JSON.stringify(presets),
                            user_id: token.id
                        })
                        .then(function (r) { // reply uuid used to generate the preset.
                            return h.response({ upload: 'successful', id: uuid }).code(200);
                        })
                        .catch(function (error) {
                            throw Boom.badImplementation(error.message);
                        });

                } catch (error) {
                    return Promise.reject(Boom.badImplementation(error));
                }
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
            validate: {
                payload: presetConfigSchema,
                failAction: (request, h, err) => {
                    return err;
                }
            }
        }
    })
};
