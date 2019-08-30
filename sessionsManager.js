'use strict';

let sessions = {};

/**
 * Manages hashMap of current OSM oAuth sessions.
 *
 * values include information like origin of request,
 * as well as the different tokens provided and needed
 * while going through the OSM oAuth flow.
 * Once a flow is complete (in literal terms, when we reply the redirect in the /auth/callback route)
 * Or a flow has failed, we remove a session.
 *
 */
module.exports = {
    add: function(session, value) {
        sessions[session] = value;
    },
    get: function(idx) {
        return sessions[idx];
    },
    update: function(session, value) {
        let sessionConfig = sessions[session];
        if (sessionConfig) {
            sessionConfig = Object.assign(sessionConfig, value);
        }
    },
    sessions: function() {
        return Object.keys(sessions);
    },
    remove: function(session) {
        delete sessions[session];
    },
    clear: function() {
        sessions = {};
    }
};
