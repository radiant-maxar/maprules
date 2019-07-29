'use strict';

const request = require('request');

/**
 * A little wrapper around the request library to make it a promise!
 */
let requestPromise = function(options) {
    return new Promise (function(resolve, reject) {
        request(options, function(err, rs, body) {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
};

module.exports = requestPromise;

