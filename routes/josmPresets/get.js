'use strict';

const uuidSchema = require('../../schemas/components').uuid;

module.exports = {
    method: 'GET',
    path: '/config/{id}/presets/JOSM',
    config: {
        handler: require('../../handlers/josmPresets/index').get,
        validate: { params: { id: uuidSchema } }
    }
};