'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const seeds = require('../../testData/seeds');
const id = seeds.presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const get = require('../../routes/iDPresets').get;

module.exports = () => {
    before((done) => {
        server.liftOff(get)
            .then(function() {
                done();
            })
            .catch(function(error) {
                console.log(error.message);
            });
    });
    describe('get', () => {
        it('returns 200 and an idPresets json if id in db', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${id}/presets/iD`
            });

            server.inject(request).then(function(r) {
                const iDPresets = r.result;
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
                expect(iDPresets).not.to.be.null;
                done();
            });

        });
        it('returns 404 if id not in database', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4()}/presets/iD`
            });

            server.inject(request).then(function(r) {
                const { statusCode, message, error } = r.result;

                expect(error).to.eql('Not Found');
                expect(message).to.eql('Cannot find config for provided id and user');
                expect(statusCode).to.equal(404);
                done();
            });
        });
        it('returns 400 if id not valid', function(done) {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4() + uuidv4()}/presets/iD`
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
