'use strict';

const adaptJosmPresets = require('../../adapters').josmPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;
const { adaptError, presetExists, validateIdPathParam } = require('../helpers');

const Boom = require('@hapi/boom');

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/presets/JOSM',
        config: {
            handler: function(r, h) {
                const id = r.params.id;

                return presetExists(id)
                    .then(function(results) {
                        let config = mergePrimaries(JSON.parse(results[0].preset));
                        let josmPresets = adaptJosmPresets(config);

                        return h
                            .response(josmPresets)
                            .code(200)
                            .header('Content-Type', 'text/xml');
                    })
                    .catch(adaptError);
            },
            validate: {
                params: { id: validateIdPathParam },
                failAction: function(request, h, error) {
                    return Boom.badRequest(error.message);
                }
            }
        }
    }
};
