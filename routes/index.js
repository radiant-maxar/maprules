'use strict';

const { login, logout, callback, session, verify } = require('./auth');

module.exports = [
    login,
    logout,
    callback,
    session,
    verify,
    require('./iDPresets').get,
    require('./iDRules').get,
    require('./josmPresets').get,
    require('./josmRules').get,
    require('./mapcss').post,
    require('./presetConfig').get,
    require('./presetConfig').put,
    require('./presetConfig').post,
    require('./docs'),
    require('./spec'),
    require('./rules')
];
