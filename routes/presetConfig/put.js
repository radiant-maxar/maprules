'use strict';

const presetConfigSchema = require('../../schemas/presetConfig');
const uuidSchema = require('../../schemas/components').uuid;

module.exports = {
    method: 'PUT',
    path: '/config/{id}',
    config: {
        handler: require('../../handlers/presetConfig').put,
        validate: { 
            payload: presetConfigSchema,
            params: { id: uuidSchema },
            failAction: async (request, h, err) => err
        },
        cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] }
    }
};
