const host = process.env.HOST || 'http://localhost';
const port = process.env.PORT || '3001';
const maprules = `${host}:${port}`;

module.exports = {
    'development': {
        maprules: maprules,
        injectDefaults: { simulate: { error: false } },
        consumerKey: process.env.CONSUMER_KEY || '',
        consumerSecret: process.env.CONSUMER_SECRET || '',
        callbackUrl: `${maprules}/auth/callback`,
        osmSite: process.env.OSM_SITE || '',
        session: {
            isSecure: false, // make true when requests are made of HTTPS
            clearInvalid: true,
            strictHeader: false
        },
        jwt: process.env.JWT || '',
        sessionKey: process.env.SESSION_KEY || '',
        cors: false
    },
    'testing': {
        maprules: maprules,
        injectDefaults: { simulate: { error: false }},
        consumerKey: process.env.CONSUMER_KEY || '',
        consumerSecret: process.env.CONSUMER_SECRET || '',
        callbackUrl: `${maprules}/auth/callback`,
        osmSite: process.env.OSM_SITE || '',
        session: {
            isSecure: false, // make true when requests are made of HTTPS
            clearInvalid: true,
            strictHeader: true
        },
        jwt: process.env.JWT || '',
        sessionKey: process.env.SESSION_KEY || '',
        cors: true
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
