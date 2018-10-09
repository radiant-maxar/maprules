'use strict';

const path = require('path');

module.exports = { 
    directory: {
        path: path.join(process.cwd(), 'spec'),
        redirectToSlash: true,
        index: true
    }
};