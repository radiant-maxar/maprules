'use strict';

const mergeDefaults = require('./mergeDefaults');
const server = require('./server');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const config = require('../config')[process.env.NODE_ENV || 'development'];
const osm = config.osmSite;
const login = require('../routes/auth').login;
const callback = require('../routes/auth').callback;
const seedData = require('../testData/seeds');
const sessionManager = require('../sessionsManager');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

const db = require('../connection');

let oauthToken, oauthTokenSecret, oauthTokenUrl,
    requestTokenResp, userXML, oauthVerifier,
    accessToken, accessTokenSecret, accessTokenResp, sessionId,
    callbackScope, callbackRequest, scope;

before(async () => {
    oauthToken = '35zukjR4yCqbAmwrf2Vsk5i395KrhtiNBAOEW4C0';
    oauthTokenSecret = 'c5rwACKAN4RVhJsR0knDqOc7jLAXcK6nM65ZSPNU';
    oauthTokenUrl = `${osm}/oauth/authorize?oauth_token=${oauthToken}`;
    requestTokenResp = `oauth_token=${oauthToken}&oauth_token_secret=${oauthTokenSecret}&oauth_callback_confirmed=true`;
    oauthVerifier = 'sgrmg2JXOECO8ZkVD7y5';
    accessToken = 'PP9PatyLVkSA4ilO4GxiFCrrlaTnzPfgAvnxnp4N';
    accessTokenSecret = '1BDOcy9F2l388jvmKSAUvYhYimflz6nxURYKt6Fb';
    accessTokenResp = `oauth_token=${accessToken}&oauth_token_secret=${accessTokenSecret}`;
    userXML = seedData.fakeUserDetail1;

    // set up nock
    scope = nock(osm).persist(true);

    scope.post('/oauth/request_token').reply('200', function (uri, reqBody) {
        let authHeaders = this.req.headers.authorization;
        let hasHeaders = authHeaders.includes('OAuth')
            && authHeaders.includes('oauth_callback')
            && authHeaders.includes('oauth_consumer_key');

        expect(hasHeaders).to.be.true;
        return requestTokenResp;
    });

    scope.post('/oauth/access_token').times(2).reply(200, function (uri, reqBody) {
        let authHeaders = this.req.headers.authorization,
            hasHeaders = authHeaders.includes('OAuth')
                && authHeaders.includes('oauth_token')
                && authHeaders.includes('oauth_consumer_key');

        expect(hasHeaders).to.be.true;
        return accessTokenResp;
    });

    scope.get('/api/0.6/user/details').times(2).reply(200, function (uri, reqBody) {
        let headers = this.req.headers,
            contentType = headers['content-type'],
            authHeaders = headers.authorization,
            hasHeaders = authHeaders.includes('OAuth');

        expect(contentType).to.eql('text/xml');
        expect(hasHeaders).to.be.true;

        return userXML;
    });

    return await server.liftOff(login);
});
describe('login', () => {
    it('replies osm authorize url for user to log into OSM with their credentials', (done) => {
        const request = mergeDefaults({
            method: 'GET',
            url: '/auth/login'
        });

        server.inject(request).then(function (r) {
            expect(r.result).to.eql(oauthTokenUrl);
            done();
        });
    });
});

before(async () => {
    callback.config.pre = [ // add little pre method to stub session related data...
        {
            assign: 'yarInject',
            method: function (r, h) {
                sessionManager.clear();
                sessionId = uuid();
                sessionManager.add(sessionId);
                r.yar.set(sessionId, {
                    oauth_token: oauthToken,
                    oauth_token_secret: oauthTokenSecret,
                    user_agent: r.headers['user-agent']
                });
                return 'set';
            }
        }
    ];

    await server.liftOff(callback);

});
describe('callback', () => {
    beforeEach(function (done) {

        // create stubbed responses for requests the callback function makes to the osm site.
        done();
    });
    it('replies signed jwt when it receives authorized request from OSM site', function (done) {
        let request = mergeDefaults({
            method: 'GET',
            url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
        })

        server.inject(request).then(function (r) {
            let decoded = jwt.verify(r.result, config.jwt);
            expect(decoded.id).to.eql('1');
            expect(decoded.name).to.eql('test_user')
            expect(decoded.session).to.not.eql(seedData.fakeToken);

            let exp = decoded.exp;
            let now = Math.floor(Date.now() / 1000);
            let hoursTillExp = (exp - now) / 60 / 60;

            expect(hoursTillExp).to.be.eql(8);
            done();
        });

    });
    it('updates existing user/user_agent record in user session when known user is \'logging back in \'', function (done) {
        let sessionWhere = { user_id: 1, user_agent: 'shot' };
        let request = mergeDefaults({
            method: 'GET',
            url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
        })
        db('user_sessions').where(sessionWhere).then(function (results) {
            let sessionRecord = results[0];

            server.inject(request).then(function (r) {
                db('user_sessions').where(sessionWhere).then(function (results) {
                    let updatedSessionRecord = results[0];
                    expect(sessionRecord.user_id).to.eql(updatedSessionRecord.user_id);
                    expect(sessionRecord.user_agent).to.eql(updatedSessionRecord.user_agent);
                    expect(sessionRecord.id).to.not.eql(updatedSessionRecord.id);
                    done();
                });
            });

        });
    });

});