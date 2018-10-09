'use strict';

const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;

const iDPresetsAdapter = require('../../adapters').iDPresets;
const iDPresetsSchema = require('../../schemas/iDPresets');

const presetConfigs = [
    require('../../testData/presetConfig/osm/valid.json')
    // room for additional configs if bugs are found...
];

module.exports = () => {
    const tester = (presetConfig) => {
        const iDPreset = iDPresetsAdapter(presetConfig);
        const validation = Joi.validate(iDPreset, iDPresetsSchema);
        expect(validation.value).to.eql(iDPreset);
        expect(validation.error).to.be.null;
    };
    it('should build iDPresets object from presetConfig', () => {
        presetConfigs.forEach(config => {
            tester(config);
        });
    });
};
