'use strict';

const chai = require('chai');
const chaiXml = require('chai-xml');
const Joi = require('@hapi/joi');
const expect = chai.expect;

chai.use(chaiXml);

const buildPresetXML = require('../../adapters/josmPresets');
const buildGroup = require('../../adapters/josmPresets/group');
const josmPresetGroupSchema = require('../../schemas/josmPresets/groupElementSchema');

const mergePrimaries = require('../../adapters/serialize').mergePrimaries;

const presetConfigs = [
    require('../../testData/presetConfig/osm/valid.json'),
    require('../../testData/presetConfig/osm/invalid.json')
];

Promise = require('bluebird');

module.exports = () => {
    describe('buildGroup', () => {
        const tester = (presetConfig) => {
            try {
                presetConfig = mergePrimaries(presetConfig);
                const group = buildGroup(presetConfig);
                const validation = Joi.validate(group, josmPresetGroupSchema);
                const validationGroup = validation.value;


                expect(group['@name']).to.be.eql(validationGroup['@name']);

                // horrendous management of deeply equal 
                for (let i = 0; i < group.item.length; i++) {
                    const item = group.item[i];
                    const validationItem = validationGroup.item[i];
                    const itemKeys = Object.keys(item);
                
                    for (let j = 0; j < itemKeys.length; j++) {
                        const itemKey = itemKeys[j];

                        if (itemKey.indexOf('@') > -1) {
                            expect(item[itemKey]).to.be.eql(validationItem[itemKey]);
                        
                        } else {
                            const ui = item[itemKey];
                            const validationUi = validationItem[itemKey];
                            const uiKeys = Object.keys(ui);
                            
                            for (let k = 0; k < uiKeys.length; k++) {
                                const uiKey = uiKeys[k];

                                if (uiKey.indexOf('@') > -1) {
                                    expect(ui[uiKey]).to.be.eql(validationUi[uiKey]);
                                
                                } else {
                                    const listEntry = ui[uiKey];
                                    const validationListEntry = validationUi[uiKey];
                                    const listEntryKeys = Object.keys(listEntry);

                                    for (let l = 0; l < listEntry.length; l++) {
                                        const listEntryKey = listEntryKeys[l];
                                        expect(listEntry[listEntryKey]).to.be.eql(validationListEntry[listEntryKey]);

                                    }
                                }
                            }

                        }

                    }
                        
                }

                expect(validation.error).to.be.null;
                expect(buildPresetXML(presetConfig)).xml.to.be.valid();
            } catch (error) {
                throw error; 
            }
        };
        it('should translate fcodesConfig into xml-mappable jsons for the presets element', () => tester(presetConfigs[0]));
    });
};