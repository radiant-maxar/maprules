const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || '3001';

module.exports = {
    'development': {
        injectDefaults: { simulate: { error: false }}, // hapi configuration...
        consumerKey: process.env.CONSUMER_KEY || '',
        consumerSecret: process.env.CONSUMER_SECRET || '',
        callbackUrl: `${host}:${port}/auth/callback`,
        osmSite: process.env.OSM_SITE || '',
        yar: {
            cookieOptions: {
                password: process.env.YAR, // you need to make this password. make it more than 32 chars.
                isSecure: false
            }
        }
    }
};


/**
 * {
 *   injectDefaults: hapi configuration for development ** OPTIONAL **
 *   consumerKey - oauth key for osm website oAuth ** REQUIRED **
 *   consumerSecret - secret key for osm website oAuth ** REQUIRED **
 *   osmSite - url to osm website ** REQUIRED **
 *   yar - options for session manager...
 * }
*/


// Request Token URL: http://localhost:3000/oauth/request_token
// Access Token URL: http://localhost:3000/oauth/access_token
// Authorise URL: http://localhost:3000/oauth/authorize
