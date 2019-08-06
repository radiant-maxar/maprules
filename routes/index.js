'use strict';

const { login, logout, callback, session, verify, user } = require('./auth');
const presetConfig = require('./presetConfig');

module.exports = [
    login,
    logout,
    callback,
    session,
    verify,
    user,
    require('./iDPresets').get,
    require('./iDRules').get,
    require('./josmPresets').get,
    require('./josmRules').get,
    require('./mapcss').post,
    presetConfig.get,
    presetConfig.put,
    presetConfig.post,
    require('./explore').get,
    require('./docs'),
    require('./spec'),
    require('./rules')
];
