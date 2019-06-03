'use strict';

const config = require('../config')[process.env.NODE_ENV || 'testing'];
const jwt = require('jsonwebtoken');

const user = {
    id: 1,
    name: 'test_user'
};

const session = '974ca5da-d990-4e94-96e1-81a6e0209f88';

const unsignedToken = {
    id: user.id,
    name: user.name,
    session: session
}

module.exports = {
    presets: [
        {
            id: '72d5df88-c53a-458b-8247-8e691feb0d04',
            config: require('./presetConfig/osm/valid.json')
        }
    ],
    user: user,
    session: unsignedToken.session,
    fakeToken: jwt.sign(unsignedToken, config.jwt),
    fakeUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};
