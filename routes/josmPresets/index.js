'use strict';

const Boom = require('@hapi/boom');
const uuidSchema = require('../../schemas/components').uuid;
const adaptJosmPresets = require('../../adapters').josmPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;

const adaptError = require('../helpers').adaptError;
const presetExists = require('../helpers').presetExists;

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/presets/JOSM',
        config: {
            handler: (r, h) => {
                try {
                    const id = r.params.id;

                    return presetExists(id)
                        .then(function (results) {
                            const config = mergePrimaries(JSON.parse(results[0].preset));
                            const josmPresets = adaptJosmPresets(config);

                            return h
                                .response(josmPresets)
                                .code(200)
                                .header('Content-Type', 'text/xml');
                        })
                        .catch(adaptError);

                } catch (error) {
                    return Boom.badImplementation(error.message);
                }
            },
            validate: { params: { id: uuidSchema } }
        }
    }
};