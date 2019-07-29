'use strict';

const expect = require('chai').expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');
const seedId = require('../../testData/seeds').presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const get = require('../../routes/josmRules').get;

module.exports = () => {
    before(async() => await server.liftOff(get));
    describe('get', () => {
        it('returns 200 and MapCSS rules if id param in database', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${seedId}/rules/JOSM`
            });
            server.inject(request).then(function(r) {
                let rules = r.result,
                    statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
                expect(rules).not.to.be.null;
                done();
            });
        });
        it('returns 404 if id not in database', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4()}/rules/JOSM`
            });

            server.inject(request).then(function(r) {
                let { statusCode, error, message } = r.result;
                expect(statusCode).to.eql(404);
                expect(error).to.eql('Not Found');
                expect(message).to.eql('Cannot find config for provided id and user');
                done();
            });
        });
        it('returns 400 if id is invalid', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv1()}/rules/JOSM`
            });

            server.inject(request).then(function(r) {
                let { statusCode, error, message } = r.result;
                expect(statusCode).to.eql(400);
                expect(error).to.eql('Bad Request');
                expect(message).to.eql('id path parameter is invalid');
                done();
            });
        });
    });
};

