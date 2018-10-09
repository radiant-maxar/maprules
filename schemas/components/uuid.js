const Joi = require('joi');
// https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
module.exports = Joi.string().guid({ version: [ 'uuidv4' ] });