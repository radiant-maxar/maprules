'use strict';

const mapCssSchema = require('../../node_modules/mapcss-parse/schema/primitives');

module.exports = {
    method: 'POST',
    path: '/mapcss',
    config: {
        handler: require('../../handlers/mapcss').post,
        cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
        validate: {
            payload: mapCssSchema,
            failAction: async (request, h, err) => err
        }
    }
};
