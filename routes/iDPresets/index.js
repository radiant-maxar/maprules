'use strict';

const adaptIdPresets = require('../../adapters').iDPresets;
const mergePrimaries = require('../../adapters/serialize').mergePrimaries;
const presetExists = require('../helpers').presetExists;
const adaptError = require('../helpers').adaptError;

const uuidSchema = require('../../schemas/components').uuid;
const iDPresetSchema = require('../../schemas/iDPresets');


module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/presets/iD',
        config: {
            handler: function (r, h) {
                try {
                    const id = r.params.id;

                    return presetExists(id)
                        .then(function (results) {
                            const config = mergePrimaries(JSON.parse(results[0].preset));
                            return h.response(adaptIdPresets(config)).code(200);
                        })
                        .catch(adaptError);
                } catch (error) {
                    return error;

                }
            },
            validate: { params: { id: uuidSchema } },
            response: { schema: iDPresetSchema }
        }
    }
};
// module.exports = async (r, h) => {
//     try {
//         const uuid = r.params.id;

//         const query = await db('presets').select('preset').where({ id: uuid });
//         const config = mergePrimaries(JSON.parse(query[0].preset));
//         return h.response(adaptIdPresets(config)).code(200);
//     } catch (error) {
//         return error;

//     }
// };