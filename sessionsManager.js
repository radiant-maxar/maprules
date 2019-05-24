'use strict';

let sessions = [];

/**
 * Manages list of current OSM oAuth sessions.
 *
 * These are different from the json web token sessions used for being 'logged in' to maprules...
 * These are the sessions where the service is communicating w/OpenStreetMap to get user details.
 *
 */
module.exports = {
    add: function (session) {
        sessions.push(session);
    },
    all: function () {
        return sessions;
    },
    remove: function(session) {
        const idx = sessions.indexOf(session);
        if (idx !== -1) sessions.splice(idx, 1);
    }
};