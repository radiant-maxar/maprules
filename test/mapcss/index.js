'use strict';

const fixtureSession = require('../helpers').fixtureSession;

describe('mapcss', () => {
    before(async () => await fixtureSession());
    describe('handlers', require('./handlersSpec'));
});