'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const seedId = require('../../testData/seeds')[0].id;
const mergeDefaults = require('../mergeDefaults');
const get = require('../../routes/iDRules').get;

module.exports = () => {
    before(async () => await server.liftOff(get));
    describe('get', () => {
        it('returns 200 and JSON of parsd MapCSS Rules if id param in database', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${seedId}/rules/iD`
                }),
                r = await server.inject(request),
                rules = r.result,
                statusCode = r.statusCode;

            expect(statusCode).to.equal(200);
            expect(rules).not.to.be.null;

        });
        it('returns 404 if id not in database', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${uuidv4()}/rules/iD`
                }),
                r = await server.inject(request),
                statusCode = r.statusCode;

            expect(statusCode).to.equal(404);

        });
    });
};