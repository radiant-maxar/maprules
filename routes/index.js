'use strict';

module.exports = [
    require('./auth').callback,
    require('./auth').login,
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
