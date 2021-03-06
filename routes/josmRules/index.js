'use strict';

const adaptRules = require('../../adapters/rules');
const Boom = require('@hapi/boom');
const { adaptError, presetExists, validateIdPathParam } = require('../helpers');

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/rules/JOSM',
        config: {
            handler: function(r, h) {
                try {
                    const id = r.params.id;

                    return presetExists(id)
                        .then(function(results) {
                            let config = JSON.parse(results[0].preset);
                            let rules = adaptRules(config);

                            return h
                                .response(rules)
                                .code(200)
                                .header('Content-Type', 'text/css')
                                .header('X-Content-Type-Options', 'nosniff');
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
            }
        }
    }
};
