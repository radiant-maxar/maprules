'use strict';

const path = require('path');

module.exports = {
    method: 'GET',
    path: '/rules/{param*}',
    options: { auth: false },
    handler: {
        directory: {
            path: path.join(process.cwd(), 'rules'),
            redirectToSlash: true,
            index: true
        }
    }
};