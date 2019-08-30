'use strict';

const fs = require('fs-extra');
const path = require('path');
const Joi = require('@hapi/joi');
const chai = require('chai');
const expect = chai.expect;


const buildTagChecks = require('../../adapters/rules/config/tagChecks');
const buildConfigRules = require('../../adapters/rules/config');
const buildRules = require('../../adapters').rules;
const buildMapCSSRule = require('../../adapters/rules/mapCSS/rule');

const tagChecksSchema = require('../../schemas/rules/tagChecks');
const configRulesSchema = require('../../schemas/rules/configRules');

const presetConfigs = [
    require('../../testData/presetConfig/osm/valid.json'),
    require('../../testData/presetConfig/osm/invalid.json'),
    require('../../testData/presetConfig/osm/anotherInvalid.json')
];

const mapCSSFiles = [
    '/testData/mapCSS/osm/valid.validator.mapcss'
];

module.exports = () => {
    describe('tagChecks', () => {
        it('converts an array of preset fields into a valid tag checks object', () => {
            let validPresetConfig = presetConfigs[0];
            let configName = validPresetConfig.name;
            let presets = validPresetConfig.presets;

            presets.forEach((preset) => {
                let primary = preset.primary;
                let presetName = preset.name;
                let fields = preset.fields;

                fields.forEach((field) => {

                    buildTagChecks(field, primary, presetName, configName).forEach((tagCheck) => {
                        const validation = Joi.validate(tagCheck, tagChecksSchema);
                        expect(validation.value).to.be.deep.equal(tagCheck);
                        expect(validation.error).to.be.null;
                    });

                });
            });
        });
        it('catches invalid presets', () => {
            let invalidPresetConfig = presetConfigs[1];
            let configName = invalidPresetConfig.name;

            let primary = invalidPresetConfig.presets[0].primary;
            let presetName = invalidPresetConfig.presets[0].name;
            let testField = invalidPresetConfig.presets[0].fields[0];

            expect(() => buildTagChecks(testField, primary, presetName, configName)).to.throw;
        });
    });

    describe('configRules', () => {
        it('converts a preset object into a valid presetRules object', async() => {
            const validConfig = presetConfigs[0];
            buildConfigRules(validConfig).forEach(configRule => {
                const validation = Joi.validate(configRule, configRulesSchema);
                expect(validation.value).to.deep.equal(configRule);
                expect(validation.error).to.be.null;
            });
        });
    });
    describe('rules', () => {
        it('convert rulesConfig into a valid MapCSS validator file', () => {
            const file = mapCSSFiles[0];
            const validConfig = presetConfigs[0];
            const staticPath = path.join(process.cwd(), file);
            const staticMapCSS = fs.readFileSync(staticPath).toString().replace(/\s/g, '');
            const adaptedMapCSS = buildRules(validConfig).replace(/\s/g, '');
            expect(staticMapCSS).to.be.eql(adaptedMapCSS);
        });
        it('builds a MapCSS rule when fieldConditional is not present', () => {
            const input = {
                toThrow: 'throwError',
                base: '[highway=yes]',
                message: 'highway cannot be coupled with yes'
            };
            const expectation = 'node[highway=yes]{throwError:"highway cannot be coupled with yes";}'.replace(/\s/g,'');
            expect(buildMapCSSRule(input, 'node').replace(/\n/g,'').replace(/\s+/g,'')).to.be.eql(expectation);
        });
        it('catches errors when parsing', async() => {
            const invalidConfig = presetConfigs[1];
            expect(() => buildRules(invalidConfig)).to.throw(Error);
        });
    });
};
