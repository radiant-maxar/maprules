'use strict';

const injectDefaults = require('../config')['development'].injectDefaults;

module.exports = (request) => Object.assign(injectDefaults, request);

// helper for using hapi's test server....