'use strict';

const mergeDefaults = require('../helpers').mergeDefaults;
const server = require('../server');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');
const config = require('../../config')[process.env.NODE_ENV || 'development'];
const osm = config.osmSite;
const { login, logout, callback, session } = require('../../routes/auth');
const seedData = require('../../testData/seeds');
const sessionManager = require('../../sessionsManager');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

const db = require('../../connection');

let oauthToken, oauthTokenSecret, oauthTokenUrl,
    requestTokenResp, userXML, userXML2,
    oauthVerifier, accessToken, accessTokenSecret,
    accessTokenResp, sessionId, scope;

describe('auth', () => {
    before(async() => await server.liftOff(session));
    describe('session', () => {
        it('replies with a 200 code when provided valid jwt', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: '/auth/session'
            }, true);

            server.inject(request).then(function(r) {
                expect(r.statusCode).to.eql(200);
                done();
            });
        });
        it('replies with 401 code when provided non-jwt token in the session cookie', function(done) {
            const request = Object.assign({}, mergeDefaults({
                method: 'GET',
                url: '/auth/session',
                headers: { Cookie: 'maprules_session=womp' }
            }));

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;
                const wwwAuthenticate = r.headers['www-authenticate'];
                expect(statusCode).to.eql(401);
                expect(error).to.eql('Unauthorized');
                expect(message).to.eql('invalid token provided');
                expect(wwwAuthenticate).to.eql(`Bearer error="${message}"`);
                done();
            }).catch(function(error) {
                throw error;
            });

        });
        it('replies a 401 when the requests lacks the authorization header', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: '/auth/session'
            });

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;
                const wwwAuthenticate = r.headers['www-authenticate'];

                expect(statusCode).to.eql(401);
                expect(error).to.eql('Unauthorized');
                expect(message).to.eql('no token provided');
                expect(wwwAuthenticate).to.eql(`Bearer error="${message}"`);
                done();
            }).catch(function(error) {
                throw error;
            });
        });

        it('replies a 401 when the jwt does not represent a session in the sessions table', function(done) {
            const unknownJWT = jwt.sign({
                session: uuid(),
                id: 1,
                name: 'test_user',
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8)
            }, config.jwt);

            const request = mergeDefaults({
                method: 'GET',
                url: '/auth/session',
                headers: { Cookie: `maprules_session=${unknownJWT}` }
            });

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;
                const wwwAuthenticate = r.headers['www-authenticate'];

                expect(statusCode).to.eql(401);
                expect(error).to.eql('Unauthorized');
                expect(message).to.eql('token invalid, session unknown');
                expect(wwwAuthenticate).to.eql(`Bearer error="${message}"`);
                done();
            }).catch(function(error) {
                throw error;
            });


        });
        it('replies a 401 when client user agents do not match', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: '/auth/session'
            }, true);

            request.headers['user-agent'] = 'alvin_dewey';

            server.inject(request).then(function(r) {
                const { statusCode, message, error } = r.result;
                const wwwAuthenticate = r.headers['www-authenticate'];

                expect(statusCode).to.eql(401);
                expect(error).to.eql('Unauthorized');
                expect(message).to.eql('token invalid');
                expect(wwwAuthenticate).to.eql(`Bearer error="${message}"`);
                done();
            });
        });
        it('replies a 401 when the jwt has expired', function(done) {
            // add dummy record into user_sessions;
            const dummyId = uuid();
            const dummyJWT = jwt.sign({
                session: dummyId,
                id: 1,
                name: 'test_user',
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8)
            }, config.jwt);

            db('user_sessions')
                .insert({
                    id: dummyId,
                    user_id: 1,
                    user_agent: 'carmen_sandiego',
                    created_at: new Date('December 17, 1995 03:24:00')
                })
                .then(function() {
                    const request = mergeDefaults({
                        method: 'GET',
                        url: '/auth/session',
                        headers: { Cookie: `maprules_session=${dummyJWT}` }
                    });

                    server.inject(request).then(function(r) {
                        const { statusCode, message, error } = r.result;
                        const wwwAuthenticate = r.headers['www-authenticate'];

                        expect(statusCode).to.eql(401);
                        expect(error).to.eql('Unauthorized');
                        expect(message).to.eql('token invalid, session expired');
                        expect(wwwAuthenticate).to.eql(`Bearer error="${message}"`);

                        db('user_sessions') // clean up the session...
                            .where({ id: dummyId, user_id: 1 })
                            .delete()
                            .then(function() { done(); });
                    });
                }).catch(function(error) {
                    throw error;
                });
        });
    });

    before(async() => {
        oauthToken = '35zukjR4yCqbAmwrf2Vsk5i395KrhtiNBAOEW4C0';
        oauthTokenSecret = 'c5rwACKAN4RVhJsR0knDqOc7jLAXcK6nM65ZSPNU';
        oauthTokenUrl = `${osm}/oauth/authorize?oauth_token=${oauthToken}`;
        requestTokenResp = `oauth_token=${oauthToken}&oauth_token_secret=${oauthTokenSecret}&oauth_callback_confirmed=true`;
        oauthVerifier = 'sgrmg2JXOECO8ZkVD7y5';
        accessToken = 'PP9PatyLVkSA4ilO4GxiFCrrlaTnzPfgAvnxnp4N';
        accessTokenSecret = '1BDOcy9F2l388jvmKSAUvYhYimflz6nxURYKt6Fb';
        accessTokenResp = `oauth_token=${accessToken}&oauth_token_secret=${accessTokenSecret}`;
        userXML = seedData.fakeUserDetail1,
        userXML2 = seedData.fakeUserDetail2;

        // set up nock
        scope = nock(osm).persist(true);

        scope.post('/oauth/request_token').times(1).reply('200', function(uri, reqBody) {
            let authHeaders = this.req.headers.authorization;
            let hasHeaders = authHeaders.includes('OAuth')
                && authHeaders.includes('oauth_callback')
                && authHeaders.includes('oauth_consumer_key');

            expect(hasHeaders).to.be.true;
            scope.interceptors.shift();
            return requestTokenResp;
        });

        scope.post('/oauth/access_token').times(3).reply(200, function(uri, reqBody) {
            let authHeaders = this.req.headers.authorization,
                hasHeaders = authHeaders.includes('OAuth')
                    && authHeaders.includes('oauth_token')
                    && authHeaders.includes('oauth_consumer_key');

            expect(hasHeaders).to.be.true;
            return accessTokenResp;
        });

        scope.get('/api/0.6/user/details').times(2).reply(200, function(uri, reqBody) {
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

            server.inject(request).then(function(r) {
                expect(r.result).to.eql(oauthTokenUrl);
                done();
            });
        });
    });

    before(async() => {
        callback.config.pre.unshift({
            // add little pre method to stub session related data...
            assign: 'yarInject',
            method: function(r, h) {
                sessionManager.clear();
                sessionId = uuid();
                sessionManager.add(sessionId, {
                    oauth_token: oauthToken,
                    oauth_token_secret: oauthTokenSecret,
                    user_agent: r.headers['user-agent']
                });
                return 'set';
            }
        });

        await server.liftOff(callback);

    });
    describe('callback', () => {
        it('replies a redirect response that includes a JWT in its \'Set-Cookie\' response header', function(done) {
            let request = mergeDefaults({
                method: 'GET',
                url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
            });

            server.inject(request).then(function(r) {
                expect(r.statusCode).to.eql(302);
                expect(r.headers.location).to.eql(
                    `undefined/login.html?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
                );


                let cookieHeaders = r.headers['set-cookie'][0].split(';').reduce(function(map, header) {
                    var [name, value] = header.trim().split('=');
                    map[name] = value || '';
                    return map;
                }, {});
                let decoded = jwt.verify(cookieHeaders['maprules_session'], config.jwt);

                expect(decoded.id).to.eql('1');
                expect(decoded.name).to.eql('test_user');
                expect(decoded.session).to.not.eql(seedData.fakeToken);

                let exp = decoded.exp;
                let now = Math.floor(Date.now() / 1000);
                let hoursTillExp = Math.ceil((exp - now) / 60 / 60);

                expect(hoursTillExp).to.be.eql(8);
                done();
            });

        });
        it('updates existing user/user_agent record in user session when known user is \'logging back in \'', function(done) {
            let sessionWhere = { user_id: 1, user_agent: 'shot' };
            let request = mergeDefaults({
                method: 'GET',
                url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
            });
            db('user_sessions').where(sessionWhere).then(function(results) {
                let sessionRecord = results[0];

                server.inject(request).then(function(r) {
                    db('user_sessions').where(sessionWhere).then(function(results) {
                        let updatedSessionRecord = results[0];
                        expect(sessionRecord.user_id).to.eql(updatedSessionRecord.user_id);
                        expect(sessionRecord.user_agent).to.eql(updatedSessionRecord.user_agent);
                        expect(sessionRecord.id).to.not.eql(updatedSessionRecord.id);
                        done();
                    });
                });

            });
        });
        it('creates a new user/user_agent record when given different user agent', function(done) {
            let request = mergeDefaults({
                method: 'GET',
                headers: { 'user-agent': 'tohs' },
                url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
            });

            server.inject(request).then(function(r) {
                db('user_sessions').where({ user_id: 1 }).then(function(results) {
                    expect(results.length).to.eql(2);
                    expect(results[0].user_agent).to.eql('shot');
                    expect(results[1].user_agent).to.eql('tohs');
                    done();
                });
            });
        });
        it('creates a new user in users table and new session in sessions table', function(done) {
            nock.cleanAll();
            // mock replying the new user data...
            scope = nock(osm);

            scope.post('/oauth/access_token').times(3).reply(200, function(uri, reqBody) {
                let authHeaders = this.req.headers.authorization,
                    hasHeaders = authHeaders.includes('OAuth')
                        && authHeaders.includes('oauth_token')
                        && authHeaders.includes('oauth_consumer_key');

                expect(hasHeaders).to.be.true;
                return accessTokenResp;
            });

            scope.get('/api/0.6/user/details').reply(200, function(uri, reqBody) {
                let headers = this.req.headers,
                    contentType = headers['content-type'],
                    authHeaders = headers.authorization,
                    hasHeaders = authHeaders.includes('OAuth');

                expect(contentType).to.eql('text/xml');
                expect(hasHeaders).to.be.true;

                return userXML2;
            });
            let request = mergeDefaults({
                method: 'GET',
                url: `/auth/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`
            });

            server.inject(request).then(function(r) {
                Promise.all([db('users'), db('user_sessions')]).then(function(results) {
                    let [users, sessions] = results;

                    expect(users.length).to.eql(2);
                    expect(sessions.length).to.eql(3);
                    expect(users[0].name).to.eql('test_user');
                    expect(users[1].name).to.eql('test_user_2'); // new user
                    expect(sessions.filter(function(s) { return s.user_id === 2; }).length).to.eql(1); // new user
                    expect(sessions.filter(function(s) { return s.user_id === 1; }).length).to.eql(2);

                    done();
                });
            });

        });
    });

    before(async() => server.liftOff(logout));
    describe('logout', function(done) {
        // add a fake session
        let sessionJWT, signedJWT, userAgent;
        before(function(done) {
            let sessionId = uuid();
            userAgent = 'james_bond';
            sessionJWT = {
                id: 1,
                name: 'test_user',
                session: sessionId,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8)
            };
            signedJWT = jwt.sign(sessionJWT, config.jwt);

            let sessionInsert = {
                user_id: 1,
                id: sessionId,
                user_agent: userAgent
            };

            db('user_sessions')
                .insert(sessionInsert)
                .then(function() {
                    done();
                })
                .catch(function(error) {
                    throw error;
                });
        });
        it('removes record in user_sessions table for given jwt', function(done) {
            let request = mergeDefaults({
                method: 'POST',
                url: '/auth/logout',
                headers: { Cookie: `maprules_session=${signedJWT}`, 'user-agent': 'james_bond' }
            });

            // logout with session we just made...
            server.inject(request).then(function(r) {
                expect(r.statusCode).to.eql(200); // we should have successfully logged out...
                db('user_sessions') // the session record should be removed from user_sessions table...
                    .where({ user_id: 1, user_agent: userAgent })
                    .then(function(sessions) {
                        expect(sessions.length).to.eql(0);
                        done();
                    });
            });
        });
        it('throws 401 if trying to logout without providing token', function(done) {
            let request = mergeDefaults({
                method: 'POST',
                url: '/auth/logout'
            });

            server.inject(request).then(function(r) {
                expect(r.statusCode).to.eql(401);
                done();
            });
        });
    });
});
