'use strict';

const uuidSchema = require('../../schemas/components').uuid;
const presetConfigSchema = require('../../schemas/presetConfig');

module.exports = {
    method: 'GET',
    path: '/config/{id}',
    config: {
        handler: require('../../handlers/presetConfig').get,
        validate: { params: { id: uuidSchema } },
        response: { schema: presetConfigSchema }
    }
};
