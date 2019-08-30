'use strict';

const db = require('../connection');
const Boom = require('@hapi/boom');
const uuidSchema = require('../schemas/components').uuid;

const _notFound = 'Cannot find config for provided id and user';

exports.notFound = _notFound;
exports.presetExists = function(id, userId) {
    let where = { id: id };

    if (userId) where.user_id = userId;

    return db('presets')
        .where(where)
        .then(function(results) {
            if (!results.length) {
                throw new Error(_notFound);
            };
            return results;
        });
};

exports.adaptError = function(error) {
    if (error.message === _notFound) {
        return Boom.notFound(error.message);
    } else {
        return Boom.badImplementation(error.message);
    }
};

exports.validateIdPathParam = uuidSchema.error(new Error('id path parameter is invalid'));

/**
 * Little helper function to prevent manually adding query string params in response.
 * Doing so is an easy way to 'miss a character and bring the system down!'
 */
exports.toQueryString = function(queryParams) {
    return Object.keys(queryParams).map(function(param) {
        return `${param}=${queryParams[param]}`;
    }).join('&');
};

