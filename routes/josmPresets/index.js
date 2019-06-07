'use strict';

const adaptJosmPresets = require('../../adapters').josmPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;

const uuidSchema = require('../../schemas/components').uuid;

const presetExists = require('../helpers').presetExists;
const adaptError = require('../helpers').adaptError;

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/presets/JOSM',
        config: {
            handler: function (r, h) {
                const id = r.params.id;

                return presetExists(id)
                    .then(function (results) {
                        let config = mergePrimaries(JSON.parse(results[0].preset));
                        let josmPresets = adaptJosmPresets(config);

                        return h
                            .response(josmPresets)
                            .code(200)
                            .header('Content-Type', 'text/xml');
                    })
                    .catch(adaptError);
            },
            validate: { params: { id: uuidSchema } }
        }
    }
};
