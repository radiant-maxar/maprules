'use strict';

const Boom = require('@hapi/boom');

const testRoute = {
    method: 'GET',
    path: '/',
    handler: async function (request, h) {
        try {
            await request.server.auth.verify(request);

        } catch (err) {
            return Boom.unauthorize()
        }
    }
}


before(async () => await server.liftOff());
describe('post', () => {
    it ('replies 200 if provided valid signed JWT', async () => {})