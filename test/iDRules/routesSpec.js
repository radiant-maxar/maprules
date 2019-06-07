'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const seedId = require('../../testData/seeds').presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const get = require('../../routes/iDRules').get;

module.exports = () => {
    before(async() => await server.liftOff(get));
    describe('get', () => {
        it('returns 200 and JSON of parsed MapCSS Rules if id param in database', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${seedId}/rules/iD`
            });
            server.inject(request).then(function(r) {
                const rules = r.result;
                const statusCode = r.statusCode;

                expect(statusCode).to.eql(200);
                expect(rules).not.to.be.null;
                done();
            });
        });
        it('returns 404 if id not in database', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4()}/rules/iD`
            });

            server.inject(request).then(function(r) {
                const { statusCode, error, message } = r.result;

                expect(statusCode).to.eql(404);
                expect(error).to.eql('Not Found');
                expect(message).to.eql('Cannot find config for provided id and user');
                done();
            }).catch(function(error) {
                throw error;
            });
        });
        it('replies 400 if id valid', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4() + uuidv4()}/rules/iD`
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