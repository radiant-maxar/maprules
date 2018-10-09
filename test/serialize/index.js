'use strict';

const chai = require('chai');
const expect = chai.expect;
const Joi = require('joi');

const flattenElements = require('../../adapters/helpers').flattenElements;

const mergePrimaries = require('../../adapters/serialize').mergePrimaries;
const mergePresets = require('../../adapters/serialize').mergePresets;

describe('serialize', () => {
    describe('mergePrimaries', () => {
        it('moves must have / may be fields to the primary map', () => {
            [
                {
                    test: {
                        name: 'test',
                        presets: [
                            {
                                name: 'clinic',
                                geometry: 'way',
                                fields: [
                                    {
                                        key: 'amenity',
                                        keyCondition: 1,
                                        label: 'Amenity',
                                        placeholder: '...',
                                        values: [
                                            {
                                                valCondition: 1,
                                                values: [ 'healthcare' ]
                                            }
                                        ]
                                    }
                                ],
                                primary: [
                                    { key: 'building', val: 'yes' }
                                ]
                            }
                        ],
                        disabledFeatures: []
                    },
                    result: {
                        name: 'test',
                        presets: [
                            {
                                name: 'clinic',
                                geometry: 'way',
                                fields: [],
                                primary: [
                                    { key: 'building', val: 'yes' },
                                    { key: 'amenity', val: 'healthcare' }
                                ]
                            }

                        ],
                        disabledFeatures: []
                    }
                },
                {
                    test: {
                        name: 'test',
                        presets: [
                            {
                                name: 'clinic',
                                geometry: 'way',
                                fields: [
                                    {
                                        key: 'amenity',
                                        keyCondition: 1,
                                        label: 'Amenity',
                                        placeholder: '...',
                                        values: [
                                            {
                                                valCondition: 1,
                                                values: [ 'healthcare', 'public_health' ]
                                            }
                                        ]
                                    }
                                ],
                                primary: [
                                    { key: 'building', val: 'yes' }
                                ]
                            }
                        ],
                        disabledFeatures: []
                    },
                    result: {
                        name: 'test',
                        presets: [
                            {
                                name: 'clinic',
                                geometry: 'way',
                                fields: [
                                    {
                                        key: 'amenity',
                                        keyCondition: 1,
                                        label: 'Amenity',
                                        placeholder: '...',
                                        values: [
                                            {
                                                valCondition: 1,
                                                values: [ 'healthcare', 'public_health' ]
                                            }
                                        ]
                                    }
                                ],
                                primary: [
                                    { key: 'building', val: 'yes' }
                                ]
                            }

                        ],
                        disabledFeatures: []
                    }
                }
            ].forEach(t => {
                expect(mergePrimaries(t.test)).to.eql(t.result);
            });
        });
    });
    describe('mergePresets', () => {
        it('merges presets when meaningful properties match', () => {
            const test = [
                {
                    name: 'Health Clinic',
                    geometry: ['point'],
                    fields: [
                        {
                            keyCondition: 1,
                            key: 'building',
                            values: [
                                {
                                    valCondition: 1,
                                    values: ['yes', 'house']
                                }
                            ]
                        },
                        {
                            keyCondition:  1,
                            key: 'source',
                            values: [
                                {
                                    valCondition: 1,
                                    values: ['american_red_cross', 'missing_maps']
                                }
                            ]
                        },
                        {
                            keyCondition: 1,
                            key: 'floors',
                            values: [
                                {
                                    valCondition: 3,
                                    values: ['4']
                                },
                                {
                                    valCondition: 5,
                                    values: ['1']
                                }
                            ]
                        }
                    ],
                    primary: [
                        { key: 'amenity', val: 'clinic' },
                        { key: 'healthcare', val: 'public' }
                    ]
                },
                {
                    name: 'Health Clinic',
                    geometry: ['area'],
                    fields: [
                        {
                            keyCondition: 1,
                            key: 'building',
                            values: [
                                {
                                    valCondition: 1,
                                    values: ['yes', 'house']
                                }
                            ]
                        },
                        {
                            keyCondition:  1,
                            key: 'source',
                            values: [
                                {
                                    valCondition: 1,
                                    values: ['american_red_cross', 'missing_maps']
                                }
                            ]
                        },
                        {
                            keyCondition: 1,
                            key: 'floors',
                            values: [
                                {
                                    valCondition: 3,
                                    values: ['4']
                                },
                                {
                                    valCondition: 5,
                                    values: ['1']
                                }
                            ]
                        }
                    ],
                    primary: [
                        { key: 'amenity', val: 'clinic' },
                        { key: 'healthcare', val: 'public' }
                    ]
                }
            ];

            const merged = mergePresets(test);
            expect(merged.length).to.eql(1);
  
            const healthClinic = merged[0];

            expect(healthClinic.geometry).to.eql(['point', 'area']);
            
            // just a wierd way to do deep checking? 
            // see that at each level the condition + import values 
            // matches what the input merge-able presets have...
            expect(healthClinic.primary.map(p => `${p.key}:${p.val}`)).to.eql(['healthcare:public','amenity:clinic']);
            expect(healthClinic.fields.map(f => `${f.key}:${f.keyCondition}`)).to.eql(['source:1', 'floors:1', 'building:1']);
            const valuesString = flattenElements(healthClinic.fields.map(f => f.values.map(v => `${v.values.join(':')}:${v.valCondition}`)));
            expect(valuesString).to.eql(['american_red_cross:missing_maps:1', '4:3', '1:5', 'house:yes:1']);
        });
        it('does not merge presets when meaningful properties do not match', () => {
            [
                [
                    {
                        name: 'Health Clinic',
                        geometry: ['point'],
                        fields: [
                            {
                                keyCondition: 1,
                                key: 'building',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['yes', 'house']
                                    }
                                ]
                            },
                            {
                                keyCondition:  1,
                                key: 'source',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['american_red_cross', 'missing_maps']
                                    }
                                ]
                            },
                            {
                                keyCondition: 1,
                                key: 'floors',
                                values: [
                                    {
                                        valCondition: 3,
                                        values: ['4']
                                    },
                                    {
                                        valCondition: 5,
                                        values: ['1']
                                    }
                                ]
                            }
                        ],
                        primary: [
                            { key: 'amenity', val: 'clinic' },
                            { key: 'healthcare', val: 'public' }
                        ]
                    },
                    {
                        name: 'Health Clinic',
                        geometry: ['area'],
                        fields: [
                            {
                                keyCondition: 1,
                                key: 'building',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['yes', 'house']
                                    }
                                ]
                            },
                            {
                                keyCondition:  1,
                                key: 'source',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['american_red_cross', 'missing_maps']
                                    }
                                ]
                            },
                            {
                                keyCondition: 1,
                                key: 'floors',
                                values: [
                                    {
                                        valCondition: 3,
                                        values: ['4']
                                    },
                                    {
                                        valCondition: 5,
                                        values: ['1']
                                    }
                                ]
                            }
                        ],
                        primary: [
                            { key: 'amenity', val: 'clinic' }
                        ]
                    }
                ],
                [
                    {
                        name: 'Health Clinic',
                        geometry: ['point'],
                        fields: [
                            {
                                keyCondition: 0,
                                key: 'building',
                                values: []
                            },
                            {
                                keyCondition:  1,
                                key: 'source',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['american_red_cross', 'missing_maps']
                                    }
                                ]
                            },
                            {
                                keyCondition: 1,
                                key: 'floors',
                                values: [
                                    {
                                        valCondition: 3,
                                        values: ['4']
                                    },
                                    {
                                        valCondition: 5,
                                        values: ['1']
                                    }
                                ]
                            }
                        ],
                        primary: [
                            { key: 'amenity', val: 'clinic' },
                            { key: 'healthcare', val: 'public' }
                        ]
                    },
                    {
                        name: 'Health Clinic',
                        geometry: ['area'],
                        fields: [
                            {
                                keyCondition: 1,
                                key: 'building',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['yes', 'house']
                                    }
                                ]
                            },
                            {
                                keyCondition:  1,
                                key: 'source',
                                values: [
                                    {
                                        valCondition: 1,
                                        values: ['american_red_cross', 'missing_maps']
                                    }
                                ]
                            },
                            {
                                keyCondition: 1,
                                key: 'floors',
                                values: [
                                    {
                                        valCondition: 3,
                                        values: ['4']
                                    },
                                    {
                                        valCondition: 5,
                                        values: ['1']
                                    }
                                ]
                            }
                        ],
                        primary: [
                            { key: 'amenity', val: 'clinic' },
                            { key: 'healthcare', val: 'public' }
                        ]
                    }
                ]
            ].forEach(test => expect(mergePresets(test).length).to.eql(2));
        });
    });
});