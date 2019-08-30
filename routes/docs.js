
'use strict';

const path = require('path');

module.exports = {
    method: 'GET',
    path: '/docs/{param*}',
    options: { auth: false },
    handler: {
        directory: {
            path: path.join(process.cwd(), 'doc'),
            redirectToSlash: true,
            index: true
        }
    }
};
