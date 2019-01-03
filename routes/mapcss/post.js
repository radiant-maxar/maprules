'use strict';

module.exports = {
    method: 'POST',
    path: '/mapcss',
    config: {
        handler: require('../../handlers/mapcss').post,
        cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
        validate: {
    		failAction: async (request, h, err) => err
        }
    }
};
