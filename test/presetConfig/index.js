'use strict';

const fixtureSession = require('../helpers').fixtureSession;

describe('presetConfig', () => {
    describe('schema', require('./schemaSpec'));
    before(async () => await fixtureSession());
    describe('routes', require('./routesSpec'));
});
