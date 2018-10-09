'use strict';

const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;

const presetConfigSchema = require('../../schemas/presetConfig');

const presetConfigs = [
    require('../../testData/presetConfig/osm/valid.json')
];

const invalidPresetConfigs = [
    require('../../testData/presetConfig/osm/invalid.json')
];

module.exports = () => {
    it('should parse, validate, and proceed when payload is valid', () => {
        presetConfigs.forEach(presetConfig => {
            const validation = Joi.validate(presetConfig, presetConfigSchema);

            expect(validation.value).to.deep.equal(presetConfig);
            expect(validation.error).to.be.null;
        });
    });

    it('should parse, invalidate, and halt when payload is invalid', () => {
        invalidPresetConfigs.forEach(presetConfig => {
            const validation = Joi.validate(presetConfig, presetConfigSchema);
            expect(validation.error).to.throw;
        });
    });
};