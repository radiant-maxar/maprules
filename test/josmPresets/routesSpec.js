'use strict';

const chai = require('chai');
const chaiXml = require('chai-xml');

const expect = chai.expect;
chai.use(chaiXml);

const server = require('../server');
const uuidv4 = require('uuid/v4');
const seedId = require('../../testData/seeds').presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const get = require('../../routes/josmPresets').get;


module.exports = () => {
    before(async () => await server.liftOff(get));
    describe('get', () => {
        it('replies 200 and a valid xml if id extant in db', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${seedId}/presets/JOSM`
                }),
                r = await server.inject(request),
                statusCode = r.statusCode,
                xml = r.result;

            expect(statusCode).to.be.equal(200);
            expect(xml).xml.to.be.valid;

        });
        it('replies 404 if id not extant in db', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${uuidv4()}/presets/JOSM`
                }),
                r = await server.inject(request),
                statusCode = r.statusCode;

            expect(statusCode).to.be.equal(404);

        });
    });
};