'use strict';

const POINT = require('../constants').POINT;
const LINE = require('../constants').LINE;
const AREA = require('../constants').AREA;

const NODE = require('../constants').NODE;
const WAY = require('../constants').WAY;
const CLOSEDWAY = require('../constants').CLOSEDWAY;

/**
 * Provided maprules geometries, replies equivalent josm geometries
 * @param {Array} geometry maprules geometries
 * @return {Array} josm types
 */
exports.inferJosmGeometries = (geometry) => {
    return geometry.reduce((josmGeometries, geometry) => {
        geometry = geometry.toLowerCase();
        if (geometry === AREA) josmGeometries.push(CLOSEDWAY);
        if (geometry === LINE) josmGeometries.push(WAY);
        if (geometry === POINT) josmGeometries.push(NODE);
        return josmGeometries;
    }, []);
};