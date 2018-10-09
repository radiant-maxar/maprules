'use strict';

const path = require('path');

module.exports = { 
    directory: {
        path: path.join(process.cwd(), 'maprule'),
        listing: false,
        index: [ 'index.html'],
        redirectToSlash: false
    }
};