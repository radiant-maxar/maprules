'use strict';
const parseMapCSS = require('mapcss-parse').parse;
const Boom = require('@hapi/boom');

module.exports = async (r, h) => {
    try {
        const mapcss = r.payload;
        const rulesMapCSS = parseMapCSS(mapcss);
        const usableMapCSS = rulesMapCSS.every(obj => {
            const keys = Object.keys(obj);
            return [/geometry/, /(not)?equals/, /error|warning/].every(requiredKey => {
                return keys.findIndex(key => requiredKey.test(key)) >= 0;
            });
        });

        if (!usableMapCSS) throw new Error();

        return h.response(rulesMapCSS).header('Content-Type', 'application/json').code(200);
    } catch (error) {
        return Boom.boomify(error, { statusCode: 400 });
    }

};
