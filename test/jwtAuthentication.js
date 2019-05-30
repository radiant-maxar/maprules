'use strict';

const server = require('./server');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const seedData = require('../testData/seeds');
const config = require('../config')[process.env.NODE_ENV || 'testing'];
const mergeDefaults = require('./mergeDefaults');

const chai = require('chai');
const expect = chai.expect;

const authTestRoute = {
    method: 'GET',
    config: {
        auth: 'default',
        handler: async function (request, h) {
            try {
                return request.auth.isAuthenticated;
            } catch (err) {
                return Boom.unauthorized();
            }
        }
    },
    path: '/authTest'
}


before(async () => await server.liftOff(authTestRoute));
describe('post', () => {
    it ('replies 200 when provided valid JWT', async () => {
        const request = mergeDefaults({
            method: 'GET',
            headers: { Authorization: `Bearer ${seedData.fakeToken}` },
            url: '/authTest'
        });

        const r = await server.inject(request);
        expect(r.statusCode).to.eql(200);
        expect(r.result).to.eql(true); // result === isAuthenticated bool...
    });

    it ('replies 401 when provided invalid or no JWT', async() => {
        let request = mergeDefaults({
            method: 'GET',
            headers: { Authorization: 'Bearer blimBlam' },
            url: '/authTest'
        });
        let r = await server.inject(request);
        expect(r.statusCode).to.eql(401);

        request = mergeDefaults({ method: 'GET', url: '/authTest' });
        r = await server.inject(request);
        expect(r.statusCode).to.eql(401);
    });
});