'use strict';

const uuidSchema = require('../../schemas/components').uuid;

module.exports = {
    method: 'GET',
    path: '/config/{id}/rules/iD',
    config: {
        handler: require('../../handlers/iDRules').get,
        validate: { params: { id: uuidSchema } }
    }
};