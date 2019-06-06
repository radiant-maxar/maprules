
'use strict';

const path = require('path');

module.exports = {
    method: 'GET',
    path: '/spec/{param*}',
    options: { auth: false },
    handler: {
        directory: {
            path: path.join(process.cwd(), 'spec'),
            redirectToSlash: true,
            index: true
        }
    }
};