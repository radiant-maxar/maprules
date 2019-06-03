'use strict';

const uuidSchema = require('../../schemas/components').uuid;
const presetConfigSchema = require('../../schemas/presetConfig');
const Boom = require('@hapi/boom');
const db = require('../../connection');
const ensureExtant = require('../../handlers/helpers').ensureExtant;
const uuid4 = require('uuid/v4');
const authenticate = require('../../jwtScheme').authenticate;


module.exports = {
    get: {
        method: 'GET',
        options: { auth: 'false' },
        path: '/config/{user_name}/{id}',
        config: {
            handler: async function(r, h) {
                try {
                    const { user_name, id } = r.params;
                    const results = await db.select('id')
                        .from('presets')
                        .where('name', user_name);

                    if (!results.length) throw new Error('User does not exist');

                    const userId = results[0];

                    await ensureExtant(id, userId);

                    const query = await db.select('preset')
                        .from('presets')
                        .where({ id: id, user_id: userId });

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
    put: authenticate({
        method: 'PUT',
        path: '/config/{user_name}/{id}',
        config: {
            handler: async function (r, h) {
                try {
                    const token = r.auth.credentials;
                    const id = r.params.id;
                    await ensureExtant(id);

                    const preset = r.payload;

                    await db('presets')
                        .where({ id: id, user_id: token.id })
                        .update({ preset: JSON.stringify(preset) });

                    return h.response({ update: 'successful' }).code(200);

                } catch (error) {
                    return error;
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
            handler: async function(r, h) {
                try {
                    const token = r.auth.credentials;
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
                payload: presetConfigSchema,
                failAction: async (request, h, err) => err
            }
        }
    })
};