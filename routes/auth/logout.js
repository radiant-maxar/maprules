'use strict';

const authenticate = require('../../jwtScheme').authenticate;
const db = require('../../connection');

module.exports = authenticate({
    method: 'POST',
    path: '/auth/logout',
    config: {
        handler: function (r, h) {
            let token = r.auth.credentials;
            let userAgent = r.headers['user-agent'];
            let sessionWhere = {
                user_id: token.id,
                user_agent: userAgent,
                id: token.session
            };

            return db('user_sessions')
                .where(sessionWhere)
                .delete()
                .then(function (r) {
                    return h
                        .response('logged out')
                        .code(200)
                        .header('Content-Type', 'text')
                        .header('X-Content-Type-Options', 'nosniff');
                })
                .catch(function (e) {
                    throw e;
                });
        }
    }
});