'use strict';
const parseMapCSS = require('mapcss-parse').parse;
const Boom = require('boom');

module.exports = async (r, h) => {
    try {
        const mapcss = r.payload;
        const rulesMapCSS = parseMapCSS(mapcss);
        rulesMapCSS.includes(function(rule){
			if (![/geometry/, /equals/, /throw|error/].every((required => rule.includes(key => required.test(key))))) {
			    throw new Error();
			}
        });
	    return h.response(rulesMapCSS).header('Content-Type', 'application/json').code(200);

    } catch (error) {
        return Boom.boomify(error, { statusCode: 400 });
    }

};
