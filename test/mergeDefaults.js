'use strict';

const signedToken = require('../testData/seeds').fakeToken;
const injectDefaults = require('../config')['development'].injectDefaults;
const authorizationHeader = { Authorization: `Bearer ${signedToken}` };

module.exports = function(request, auth) {
    request = Object.assign(injectDefaults, request);
    if (auth) {
        request.headers = Object.assign(request.headers || {}, authorizationHeader);
    }
    return request;
};