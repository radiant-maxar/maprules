'use strict';

const uuidv4 = require('uuid/v4');
const valuesImplyCombo = require('../helpers').valuesImplyCombo;
const titleCase = require('../helpers').titleCase;

const getIcon = require('./helpers').getIcon;
const getTags = require('./helpers').getTags;
const makeCombo = require('./helpers').makeCombo;
const makeNumeric = require('./helpers').makeNumeric;

const ID_GENERIC_FIELDS = require('../constants').ID_GENERIC_FIELDS;
const generics = Object.keys(ID_GENERIC_FIELDS);

module.exports = (preset) => {
    const iDPreset = {
        geometry: preset.geometry, 
        tags: getTags(preset.primary),
        icon: getIcon(preset.primary),
        name: preset.name,
        fields: [],
        matchScore: 2
    };
    
    const iDFields = [];

    preset.fields.forEach(f => {
        if (f.keyCondition !== 0) {
            let field;
            let fieldId;
            if (generics.includes(f.key)) {
                fieldId = f.key;
                field = { [fieldId]: ID_GENERIC_FIELDS[fieldId] };
            } else {
                
                fieldId = uuidv4();
                const label = titleCase(f.label || f.key);

                field = {
                    [fieldId]: {
                        key: f.key,
                        label: label,
                        overrideLabel: label,
                        placeholder: f.placeholder || '...'
                    }
                };
                        
                if (f.values.length) {
                    f.values.forEach(value => {
                        if (value.valCondition === 0) {
                            field[fieldId].type = 'text';
                        } else {
                            field[fieldId] = Object.assign(
                                field[fieldId], 
                                valuesImplyCombo(value) ? makeCombo(value) : makeNumeric(value)
                            );
                        }
                    });
                } else {
                    field[fieldId].type = 'text';
                }
            }

            iDPreset.fields.push(fieldId);
            iDFields.push(field);       
        }
    });  

    return {
        preset: { [uuidv4()]: iDPreset },
        fields: iDFields
    };
};
