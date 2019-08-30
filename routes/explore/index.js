'use strict';

const Boom = require('@hapi/boom');
const db = require('../../connection');
const config = require('../../config')[process.env.NODE_ENV || 'development'];
const jwt = require('jsonwebtoken');
const isAuthorized = require('../../jwtScheme').isAuthorized;

module.exports = {
    get: {
        method: 'GET',
        path: '/explore',
        config: {
            auth: false,
            pre: [
                {
                    assign: 'sessionValidation',
                    method: function(r, h) {
                        // if we...
                        // - fail to find token, we return an empty object.
                        // - find a session, but the request client is not authorized to use the token, reply an empty object.
                        // - find client to be who we think they are, return the user object
                        return Promise.resolve(r.state.maprules_session)
                            .then(function(session) {
                                let token = jwt.verify(r.state.maprules_session, config.jwt);
                                return isAuthorized(token, r.headers['user-agent']);
                            })
                            .then(function(session) {
                                return { id: Number(session.id) };
                            })
                            .catch(function(error) {
                                return {};
                            });
                    }
                }
            ],
            handler: function(r, h) {
                const user = r.pre.sessionValidation;

                // get preset id, user id, and user name for each preset
                return db('presets')
                    .select({
                        id: 'presets.id',
                        preset: 'presets.preset',
                        user_id: 'users.id',
                        user_name: 'users.name'
                    })
                    .innerJoin('users', 'users.id', '=', 'presets.user_id')
                    .then(function(results) {
                        let presets = results.reduce(function(configs, config) {
                            configs.push({
                                preset_name: JSON.parse(config.preset).name,
                                id: config.id,
                                user_id: config.user_id,
                                user_name: config.user_name,
                                edit: config.user_id === user.id
                            });
                            return configs;
                        }, []);

                        return h.response(presets).code(200);
                    })
                    .catch(function(error) {
                        return Boom.badImplementation(error);
                    });
            }
        }
    }
};
