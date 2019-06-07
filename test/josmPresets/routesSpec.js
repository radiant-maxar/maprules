'use strict';

const chai = require('chai');
const chaiXml = require('chai-xml');

const expect = chai.expect;
chai.use(chaiXml);

const server = require('../server');
const uuidv4 = require('uuid/v4');
const seedId = require('../../testData/seeds').presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const { get } = require('../../routes/josmPresets');


module.exports = () => {
    before(async() => await server.liftOff(get));
    describe('get', () => {
        it('replies 200 and a valid xml if id extant in db', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${seedId}/presets/JOSM`
            });
            server.inject(request).then(function(r) {
                const statusCode = r.statusCode;
                const xml = r.result;

                expect(statusCode).to.be.equal(200);
                expect(xml).xml.to.be.valid;
                done();
            }).catch(function(err) {
                throw err;
            });
        });
        it('replies 404 if id not extant in db', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4()}/presets/JOSM`
            });

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;
                expect(statusCode).to.eql(404);
                expect(error).to.eql('Not Found');
                expect(message).to.eql('Cannot find config for provided id and user');

                done();
            });
        });
        it('replies 400 if id valid', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4() + uuidv4()}/presets/JOSM`
            });

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;

                expect(statusCode).to.eql(400);
                expect(error).to.eql('Bad Request');
                expect(message).to.eql('id path parameter is invalid');
                done();
            });
        });
    });
};

