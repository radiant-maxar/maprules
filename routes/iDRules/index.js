'use strict';

const adaptRules = require('../../adapters/rules');
const parseMapCSS = require('mapcss-parse').parse;

const Boom = require('@hapi/boom');

const { presetExists, adaptError, validateIdPathParam } = require('../helpers');

module.exports = {
    get: {
        method: 'GET',
        path: '/config/{id}/rules/iD',
        config: {
            handler: function(r, h) {
                try {
                    const id = r.params.id;

                    return presetExists(id)
                        .then(function(results) {
                            const config = JSON.parse(results[0].preset);
                            const adaptedRules = adaptRules(config);
                            const rulesMapCSS = adaptedRules.length ? parseMapCSS(adaptedRules) : [];

                            return h
                                .response(rulesMapCSS)
                                .header('Content-Type', 'application/json')
                                .code(200);
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
