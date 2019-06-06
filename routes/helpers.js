'use strict';

const db = require('../connection');
const Boom = require('@hapi/boom');

const _notFound = 'Cannot find config for provided id and user';

exports.notFound = _notFound;
exports.presetExists = function (id, userId) {
    let where = { id: id };

    if (userId) where.user_id = userId;

    return db('presets')
        .where(where)
        .then(function (results) {
            if (!results.length) {
                throw new Error(_notFound);
            };
            return results;
        });
};

exports.adaptError = function (error) {
    if (error.message === _notFound) {
        return Boom.notFound(error.message);
    } else {
        return Boom.badImplementation(error.message);
    }
};