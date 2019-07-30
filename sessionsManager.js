'use strict';

let sessions = {};

/**
 * Manages list of current OSM oAuth sessions.
 *
 * These are different from the json web token sessions used for being 'logged in' to maprules...
 * These are the sessions where the service is communicating w/OpenStreetMap to get user details.
 *
 */
module.exports = {
    add: function(session, value) {
        sessions[session] = value;
    },
    get: function(idx) {
        return sessions[idx];
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
