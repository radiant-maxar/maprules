'use strict';

const db = require('../connection');
const seedData = require('../testData/seeds');
const signedToken = seedData.fakeToken;
const injectDefaults = require('../config')['development'].injectDefaults;
const authorizationHeader = { Authorization: `Bearer ${signedToken}` };

exports.fixtureSession = function() {
    return db('user_sessions')
        .where({ user_id: seedData.user.id, user_agent: seedData.fakeUserAgent })
        .update({ created_at: new Date(), id: seedData.session });
};


exports.mergeDefaults = function(request, auth) {
    let merged = Object.assign(Object.assign({}, request), injectDefaults);
    if (auth) {
        merged.headers = Object.assign(merged.headers || {}, authorizationHeader);
    }
    return merged;
};
