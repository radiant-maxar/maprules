'use strict';

const uuidSchema = require('../../schemas/components').uuid;

module.exports = {
    method: 'GET',
    path: '/config/{id}/rules/JOSM',
    config: {
        handler: require('../../handlers/josmRules').get,
        validate: { params: { id: uuidSchema } }
    }
};