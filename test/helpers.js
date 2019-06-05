'use strict';

const db = require('../connection');
const seedData = require('../testData/seeds');


exports.fixtureSession = function() {
    return db('user_sessions')
        .where({ user_id: seedData.user.id, user_agent: seedData.fakeUserAgent })
        .update({ created_at: new Date(), id: seedData.session });
}