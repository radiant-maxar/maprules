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
};

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
    // fakeUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
    fakeUserAgent: 'shot', // this is what hapi uses for test mocks...
    fakeUserDetail1: '<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="OpenStreetMap server" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/"><user id="1" display_name="test_user" account_created="2016-12-18T00:00:00Z"><description></description><contributor-terms agreed="true" pd="false"/><roles><administrator/><moderator/></roles><changesets count="0"/><traces count="0"/><blocks><received count="0" active="0"/><issued count="0" active="0"/></blocks><languages><lang>en-US</lang><lang>en</lang></languages><messages><received count="0" unread="0"/><sent count="0"/></messages></user></osm>',
    fakeUserDetail2: '<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="OpenStreetMap server" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/"><user id="2" display_name="test_user_2" account_created="2016-12-18T00:00:00Z"><description></description><contributor-terms agreed="true" pd="false"/><roles><administrator/><moderator/></roles><changesets count="0"/><traces count="0"/><blocks><received count="0" active="0"/><issued count="0" active="0"/></blocks><languages><lang>en-US</lang><lang>en</lang></languages><messages><received count="0" unread="0"/><sent count="0"/></messages></user></osm>'
};
