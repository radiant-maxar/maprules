let authenticate = require('../../jwtScheme').authenticate;

module.exports = {
    callback: require('./callback'),
    login: require('./login'),
    /**
     * the jwt strategy will capture fail cases and return 401.
     * we will only ever get the the handler function if the provided jwt is considered valid.
     */
    session: authenticate({
        method: 'GET',
        path: '/auth/session',
        handler: function (r, h) {
            return h
                .response('authenticated')
                .code(200)
                .header('Content-Type', 'text')
                .header('X-Content-Type-Options', 'nosniff');
        }
    })
};