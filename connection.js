'use strict';
const connection = require('./knexfile')[process.env.NODE_ENV || 'development'];
module.exports = require('knex')(connection);
