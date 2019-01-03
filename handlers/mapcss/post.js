'use strict';
const parseMapCSS = require('mapcss-parse').parse;
const Boom = require('boom');

module.exports = async (r, h) => {
    try {
        const mapcss = r.payload;
        const rulesMapCSS = parseMapCSS(mapcss);
        
        return h.response(rulesMapCSS).header('Content-Type', 'application/json').code(200);

    } catch (error) {
        return Boom.boomify(error, { statusCode: 400 });
    }

};
