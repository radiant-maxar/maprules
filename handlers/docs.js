'use strict';

const path = require('path');

module.exports = { 
    directory: {
        path: path.join(process.cwd(), 'doc'),
        redirectToSlash: true,
        index: true
    }
};