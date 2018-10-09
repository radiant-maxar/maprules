'use strict';

const presetConfigSchema = require('../../schemas/presetConfig');

module.exports = {
    method: 'POST',
    path: '/config',
    config: {
        handler: require('../../handlers/presetConfig').post,
        cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
        validate: {
            payload: presetConfigSchema,
            failAction: async (request, h, err) => err
        }
    }
};
