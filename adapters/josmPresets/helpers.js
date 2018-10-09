'use strict';

const AREA = require('../constants').AREA;
const CLOSEDWAY = require('../constants').CLOSEDWAY;

/**
 * Provided maprules geometries, replies equivalent josm geometries
 * @param {Array} geometry maprules geometries
 * @return {Array} josm types
 */
exports.inferJosmGeometries = (geometry) => {
    return geometry.reduce((josmGeometries, geometry) => {
        if (geometry === AREA || geometry === CLOSEDWAY) {
            if (josmGeometries.indexOf(CLOSEDWAY) === -1) {
                josmGeometries.push(CLOSEDWAY);
            }
        } else {
            josmGeometries.push(geometry);
        }
        return josmGeometries;
    }, []);
};