'use strict';
const buildDisabledFeatures = require('../../adapters').disabledFeautures;
const expect = require('chai').expect;

describe('disabledFeatures', () => {
    it ('builds MapCSS rules for disabled', () => {
        [
            {
                test: [{ key: 'communication', val: [] }],
                result: {
                    osmType: 'way',
                    rules: [{
                        toThrow: 'throwError',
                        base: '[communication]',
                        message: 'The key \'communication\' is not allowed.'
                    }]
                }
            },
            {
                test: [{ key: 'building', val: ['house']}],
                result: {
                    osmType: 'way',
                    rules: [{
                        toThrow: 'throwError',
                        base: '[building]',
                        fieldConditionals: '[building][building=house]',
                        message: '\'building\' cannot be coupled with \'house\''
                    }]
                }
            },
            {
                test: [{ key: 'highway', val: ['yes', 'tertiary'] }],
                result: {
                    osmType: 'way',
                    rules: [ 
                        { 
                            toThrow: 'throwError',
                            base: '[highway]',
                            fieldConditionals: ['[highway][highway=~/^yes$|^tertiary$/]'],
                            message: 'highway cannot be coupled with \'yes\',\'tertiary\''
                        }
                    ]
                }
            } 
        ].forEach(disabled => {
            expect(buildDisabledFeatures(disabled.test, 'way')[0], disabled.rules);
        });
    });
});