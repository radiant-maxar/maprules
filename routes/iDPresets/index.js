'use strict';



const adaptIdPresets = require('../../adapters').iDPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;
const iDPresetSchema = require('../../schemas/iDPresets');

const { presetExists, adaptError, validateIdPathParam } = require('../helpers');

const Boom = require('@hapi/boom');

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/presets/iD',
        config: {
            handler: function(r, h) {
                try {
                    const id = r.params.id;

                    return presetExists(id)
                        .then(function(results) {
                            const config = mergePrimaries(JSON.parse(results[0].preset));
                            return h.response(adaptIdPresets(config)).code(200);
                        })
                        .catch(adaptError);
                } catch (error) {
                    return Boom.badImplementation(error.message);

                }
            },
            validate: {
                params: { id: validateIdPathParam },
                failAction: function(request, h, error) {
                    return Boom.badRequest(error.message);
                }
            },
            response: { schema: iDPresetSchema }
        }
    }
};
