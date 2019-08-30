'use strict';
// adapter helpers
const flattenElements = require('../../adapters/helpers').flattenElements;
const getToThrow = require('../../adapters/helpers').getToThrow;
const adaptEqualityToConditional = require('../../adapters/helpers').adaptEqualityToConditional;
const adaptNumericToMessage = require('../../adapters/helpers').adaptNumericToMessage;
const valuesImplyCombo = require('../../adapters/helpers').valuesImplyCombo;
const valuesImplyNumeric = require('../../adapters/helpers').valuesImplyNumeric;
const escaped = require('../../adapters/helpers').escaped;
// id preset helpers
const setNumericRange = require('../../adapters/iDPresets/helpers').setNumericRange;
const makeNumeric = require('../../adapters/iDPresets/helpers').makeNumeric;
const makeCombo = require('../../adapters/iDPresets/helpers').makeCombo;
const getIcon = require('../../adapters/iDPresets/helpers').getIcon;
// josm preset helpers
const inferJosmGeometries = require('../../adapters/josmPresets/helpers').inferJosmGeometries;
const josmGeometries = require('../../schemas/components').josmGeometries;
// geometry ~ osm type constants
const NODE = require('../../adapters/constants').NODE;
const WAY = require('../../adapters/constants').WAY;
const CLOSEDWAY = require('../../adapters/constants').CLOSEDWAY;
const POINT = require('../../adapters/constants').POINT;
const LINE = require('../../adapters/constants').LINE;
const AREA = require('../../adapters/constants').AREA;
// validation error constants
const THROW_ERROR = require('../../adapters/constants').THROW_ERROR;
const THROW_WARNING = require('../../adapters/constants').THROW_WARNING;

const expect = require('chai').expect;
const Joi = require('@hapi/joi');

describe('helpers', () => {
    describe('adapters', () => {
        describe('flattenElements', () => {
            it('should flatten a nested list', () => {
                const notFlat = [1, [2, 3, 4], [[[2]]]];
                const flat = [1, 2, 3, 4, 2];
                expect(flattenElements(notFlat)).to.be.eql(flat);
            });
        });
        describe('getToThrow', () => {
            it('should reply throwable for MapCSS rule', () => {
                [...Array(6).keys()].forEach(valCondition => {
                    expect(getToThrow(valCondition)).to.be.eql(valCondition === 2 ? THROW_WARNING : THROW_ERROR);
                });
            });
        });
        describe('adaptEqualityToConditional', () => {
            it('should return MapCSS selector conditional equivalent', () => {
                const buildConditional = (key, equality) => `[${key}][${key} ${equality}]`;
                const hgt = 'height';
                const gt = {
                    valCondition: 3,
                    values: ['3']
                };
                const gte = {
                    valCondition: 4,
                    values: ['4']
                };
                const lt = {
                    valCondition: 5,
                    values: ['5']
                };
                const lte = {
                    valCondition: 6,
                    values: ['6']
                };
                const e = {
                    valCondition: 1,
                    values: ['6', '10']
                };
                const ne = {
                    valCondition: 0,
                    values: ['5', '10']
                };

                expect(adaptEqualityToConditional(hgt, lt)).to.be.eql(buildConditional(hgt, `<= ${lt.values[0]}`));
                expect(adaptEqualityToConditional(hgt, lte)).to.be.eql(buildConditional(hgt, `< ${lte.values[0]}`));
                expect(adaptEqualityToConditional(hgt, gt)).to.be.eql(buildConditional(hgt, `>= ${gt.values[0]}`));
                expect(adaptEqualityToConditional(hgt, gte)).to.be.eql(buildConditional(hgt, `> ${gte.values[0]}`));
                expect(adaptEqualityToConditional(hgt, e)).to.be.eql(buildConditional(hgt, `=~/${e.values.map(v => `^${v}$`).join('|')}/`));
                expect(adaptEqualityToConditional(hgt, ne)).to.be.eql(buildConditional(hgt, `!~/${ne.values.map(v => `^${v}$`).join('|')}/`));
            });
        });
        describe('adaptNumericToMessage', () => {
            [
                {
                    test: { valCondition: 3, values: ['4'] },
                    result: 'less than 4'
                },
                {
                    test: { valCondition: 4, values: ['4'] },
                    result: 'less than or equal to 4'
                },
                {
                    test: { valCondition: 5, values: ['4'] },
                    result: 'greater than 4'
                },
                {
                    test: { valCondition: 6, values: ['4'] },
                    result: 'greater than or equal to 4'
                }
            ].forEach((t) => {
                expect(adaptNumericToMessage(t.test.values[0], t.test.valCondition)).to.eql(t.result);
            });
        });
        describe('valuesImplyCombo', () => {
            // return (0 < values.valueCondition && values.valCondition < 2) || !_impliesEqual(values);
            it('returns boolean, true if combo implied', () => {
                [...Array(7).keys()].forEach(valCondition => {
                    const v = { valCondition: valCondition, values: ['3', '4'] };
                    expect(valuesImplyCombo(v)).to.be[valCondition === 0 || 2 < valCondition ? 'false' : 'true'];
                });

            });
        });
        describe('valuesImplyNumeric', () => {
            it('returns boolean, true if numeric implied', () => {
                [
                    { test: { valCondition: 1, values: ['school', 'clinic'] }, result: 'false' },
                    { test: { valCondition: 1, values: ['2', '3'] }, result: 'true' },
                    { test: { valCondition: 2, values: ['3'] }, result: 'true' },
                    { test: { valCondition: 3, values: ['3'] }, result: 'true' },
                    { test: { valCondition: 4, values: ['3'] }, result: 'true' },
                    { test: { valCondition: 5, values: ['3'] }, result: 'true' },
                    { test: { valCondition: 6, values: ['3'] }, result: 'true' }
                ].forEach(t => expect(valuesImplyNumeric(t.test)).to.be[t.result]);
            });
        });
        describe('escaped', () => {
            it('adds escape character in front of special characters', () => {
                [
                    { orig: '24/7', escaped: '24\\/7' },
                    { orig: '(osm)', escaped: '\\(osm\\)' },
                    { orig: '{osm}', escaped: '\\{osm\\}' },
                    { orig: '[osm]', escaped: '\\[osm\\]' },
                    { orig: 'o.s.m', escaped: 'o\\.s\\.m' },
                    { orig: 'o+s+m', escaped: 'o\\+s\\+m' },
                    { orig: 'o*s*m', escaped: 'o\\*s\\*m' },
                    { orig: 'o?s?m', escaped: 'o\\?s\\?m' },
                    { orig: 'o^s^m', escaped: 'o\\^s\\^m' },
                    { orig: 'o$s$m', escaped: 'o\\$s\\$m' }
                ].forEach(testCase => {
                    expect(escaped(testCase.orig)).to.be.eql(testCase.escaped);
                });
            });
        });
    });
    describe('iDPresets', () => {
        describe('setNumericRange', () => {
            it('adapts config numeric object to iD flavor numeric ranges', () => {
                [
                    { test: { valCondition: 3, values: ['3'] }, result: { maxValue: 2 } },
                    { test: { valCondition: 4, values: ['4'] }, result: { maxValue: 4 } },
                    { test: { valCondition: 5, values: ['5'] }, result: { minValue: 6 } },
                    { test: { valCondition: 6, values: ['6'] }, result: { minValue: 6 } }
                ].forEach(t => expect(setNumericRange(t.test)).to.eql(t.result));
            });
        });
        describe('makeNumeric', () => {
            it('adapts value object to an iD preset\'s numeric field iD preset', () => {
                [
                    { test: { valCondition: 3, values: ['3'] }, result: { type: 'number', maxValue: 2 } },
                    { test: { valCondition: 4, values: ['4'] }, result: { type: 'number', maxValue: 4 } },
                    { test: { valCondition: 5, values: ['5'] }, result: { type: 'number', minValue: 6 } },
                    { test: { valCondition: 6, values: ['6'] }, result: { type: 'number', minValue: 6 } }
                ].forEach(t => expect(makeNumeric(t.test)).to.eql(t.result));
            });
        });
        describe('makeCombo', () => {
            it('adapts value object to an iD preset\'s combo field', () => {
                [
                    {
                        test: {
                            valCondition: 1,
                            values: ['school', 'clinic']
                        },
                        result: {
                            type: 'combo',
                            strings: {
                                options: {
                                    school: 'school',
                                    clinic: 'clinic'
                                }
                            }
                        }
                    },
                    {
                        test: {
                            valCondition: 2,
                            values: ['market', 'hospital']
                        },
                        result: {
                            type: 'combo',
                            strings: {
                                options: {
                                    market: 'market',
                                    hospital: 'hospital'
                                }
                            }
                        }
                    }
                ].forEach(t => expect(makeCombo(t.test)).to.eql(t.result));
            });
        });
        describe('getIcon', () => {
            it('returns icon for given set of tags', () => {
                [
                    [
                        { key: 'amenity', val: 'fast_food' },
                        { key: 'cuisine', val: 'kebab' }
                    ],
                    [
                        { key: 'cuisine', val: 'american' },
                        { key: 'amenity', val: 'restaurant' }
                    ]
                ].map(function(tags) {
                    let icon = getIcon(tags);
                    expect(icon).to.eql('maki-restaurant');
                });
            });
            it('returns maki-natural if nothing found', () => {
                const primary = [
                    { key: 'abc', val: 'edfj' }
                ];
                expect(getIcon(primary)).to.eql('maki-natural');
            });
            it('can handle a combo of key:val as well as just a key', () => {
                const primary = [
                    { key: 'amenity', val: 'bank' },
                    { key: 'brand', val: '*' },
                    { key: 'wikidata', val: 'Q9598744' }
                ];
                expect(getIcon(primary)).to.eql('maki-bank');
            });
        });
    });
    describe('josmPresets', () => {
        describe('inferJosmTypes', () => {
            it('returns josm type equivalents', () => {
                const inferred = inferJosmGeometries([POINT, LINE, AREA]);
                expect(inferred).to.eql([NODE, WAY, CLOSEDWAY]);
                inferred.forEach(i => {
                    const validation = Joi.validate(i, josmGeometries);
                    expect(validation.value).to.eql(i);
                    expect(validation.error).to.be.null;
                });
            });
        });
    });
});