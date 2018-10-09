'use strict';

const uuidSchema = require('../../schemas/components').uuid;
const iDPresetSchema = require('../../schemas/iDPresets');

module.exports = {
    method: 'GET',
    path: '/config/{id}/presets/iD',
    config: {
        handler: require('../../handlers/iDPresets').get,
        validate: { params: { id: uuidSchema } },
        response: { schema: iDPresetSchema }
    }
};