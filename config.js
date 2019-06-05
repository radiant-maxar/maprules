const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || '3001';
module.exports = {
    'development': {
        injectDefaults: { simulate: { error: false }},
        consumerKey: process.env.CONSUMER_KEY || '',
        consumerSecret: process.env.CONSUMER_SECRET || '',
        callbackUrl: `${host}:${port}/auth/callback`,
        osmSite: process.env.OSM_SITE || '',
        yar: {
            cookieOptions: {
                password: process.env.YAR, // password must be greater than 32 characters
                isSecure: false // make true when requests are made of HTTPS
            }
        },
        jwt: process.env.JWT || ''
    },
    'testing': {
        injectDefaults: { simulate: { error: false }},
        consumerKey: process.env.CONSUMER_KEY || '',
        consumerSecret: process.env.CONSUMER_SECRET || '',
        callbackUrl: `${host}:${port}/auth/callback`,
        osmSite: process.env.OSM_SITE || '',
        yar: {
            cookieOptions: {
                password: process.env.YAR,
                isSecure: false
            }
        },
        jwt: process.env.JWT || ''
    }
};


/**
 * {
 *   injectDefaults: hapi configuration for development ** OPTIONAL **
 *   consumerKey - oauth key for osm website oAuth ** REQUIRED **
 *   consumerSecret - secret key for osm website oAuth ** REQUIRED **
 *   osmSite - url to osm website ** REQUIRED **
 *   yar - options for session manager... ** REQUIRED **
 *   jwt - private key used to sign and decode JSON Web Tokens ** REQUIRED **
 * }
*/


// Request Token URL: http://localhost:3000/oauth/request_token
// Access Token URL: http://localhost:3000/oauth/access_token
// Authorise URL: http://localhost:3000/oauth/authorize
