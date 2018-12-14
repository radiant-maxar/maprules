'use strict';
// different mapcss error types
exports.THROW_WARNING = 'throwWarning';
exports.THROW_ERROR = 'throwError';

// osm types
exports.CLOSEDWAY = 'closedway';
exports.WAY = 'way';
exports.NODE = 'node';
// gis geometries
exports.AREA = 'area';
exports.POINT = 'point';
exports.LINE = 'line';

exports.ID_DEFAULTS = { point: ['point'], line: ['line'], area: ['area'], vertex: ['vertex'], relation: ['relation'] };

// default geometry iD presets!
exports.ID_GEOM_PRESETS = {
    point: { fields: ['name'], geometry: ['point'], tags: {}, name: 'Point', matchScore: 0.1} ,
    line: { fields: ['name'], geometry: ['line'], tags: {}, name: 'Line', matchScore: 0.1},
    area: { fields: ['name'], geometry: ['area'], tags: { 'area': 'yes' }, name: 'Area', matchScore: 0.1},
    vertex: { fields: [ 'name' ], geometry: [ 'vertex' ], tags: {}, name: 'Other', matchScore: 0.1},
    relation: { icon: 'iD-relation', fields: [ 'name', 'relation' ], geometry: [ 'relation' ], tags: {}, name: 'Relation', matchScore: 0.1}
};
exports.ID_GENERIC_FIELDS = {
    name: {
        key: 'name',
        type: 'localized',
        label: 'Name',
        universal: true,
        placeholder: 'Common name (if any)'
    },
    relation: {
        key: 'type',
        type: 'combo',
        label: 'Type'
    },
    comment: {
        key: 'comment',
        type: 'textarea',
        label: 'Changeset Comment',
        placeholder: 'Brief description of your contributions (required)'
    },
    source: {
        key: 'source',
        type: 'semiCombo',
        icon: 'source',
        universal: true,
        label: 'Sources',
        snake_case: false,
        caseSensitive: true,
        options: [
            'survey',
            'local knowledge',
            'gps',
            'aerial imagery',
            'streetlevel imagery'
        ]
    },
    hashtags: {
        key: 'hashtags',
        type: 'semiCombo',
        label: 'Suggested Hashtags',
        placeholder: '#example'
    }
};

exports.ID_DEFAULT_CATEGORIES = {
    'category-area': {
        icon: 'maki-natural',
        geometry: 'area',
        name: 'MapRules Area Features',
        members: ['area']
    },
    'category-point': {
        icon: 'maki-natural',
        geometry: 'point',
        name: 'MapRules Point Features',
        members: ['point']
    },
    'category-line': {
        icon: 'maki-natural',
        geometry: 'line',
        name: 'MapRules Point Features',
        members: ['line']
    }
};