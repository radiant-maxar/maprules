'use strict';

const path = require('path');

module.exports = { 
    directory: {
        path: path.join(process.cwd(), 'rules'),
        redirectToSlash: true,
        index: true
    }
};