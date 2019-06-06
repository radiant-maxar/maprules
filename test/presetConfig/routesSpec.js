'use strict';

const Joi = require('@hapi/joi');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');
const presetConfigSchema = require('../../schemas').presetConfig;
const uuidSchema = require('../../schemas/components').uuid;
const mergeDefaults = require('../helpers').mergeDefaults;
const seedData = require('../../testData/seeds');
const seedId = seedData.presets[0].id;
const signedToken = seedData.fakeToken;

const { get, post, put } = require('../../routes/presetConfig');

const validPresetConfig = require('../../testData/presetConfig/osm/valid.json');
const invalidPresetConfig = require('../../testData/presetConfig/osm/invalid.json');


module.exports = () => {
    before(async () => await server.liftOff(get));
    describe('get', () => {
        it('replies 200 and presetConfig provided uuid that exists in the db', (done) => {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${seedId}`
            });
            server.inject(request).then(function (r) {
                const statusCode = r.statusCode;
                const presetConfig = r.result;
                const validation = Joi.validate(presetConfig, presetConfigSchema);
                expect(statusCode).to.equal(200);
                expect(validation.error).to.be.null;
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 400 if uuid is invalid', (done) => {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv1()}`
            });

            server.inject(request).then(function (r) {
                expect(r.statusCode).to.equal(400);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 404 if the the uuid is not in the db', (done) => {
            const request = mergeDefaults({
                method: 'GET',
                url: `/config/${uuidv4()}`
            });
            server.inject(request).then(function (r) {
                expect(r.statusCode).to.equal(404);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
    });
    before(async () => await server.liftOff(put));
    describe('put', () => {
        it('replies 200 when the uuid exists in db and presetConfig is valid', (done) => {
            let test = Object.assign({}, validPresetConfig); test.name = 'bew';
            const request = mergeDefaults({
                method: 'PUT',
                payload: test,
                url: `/config/${seedId}`
            }, true);

            server.inject(request).then(function (r) {
                expect(r.statusCode).to.equal(200);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 400 if the presetConfig is invalid', (done) => {
            const request = mergeDefaults({
                method: 'PUT',
                payload: invalidPresetConfig,
                url: `/config/${seedId}`
            }, true);

            server.inject(request).then(function (r) {
                const statusCode = r.statusCode;
                const message = r.result.message;

                expect(statusCode).to.be.equal(400);
                expect(message).to.not.be.null;
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 400 if the uuid is invalid', (done) => {
            const request = mergeDefaults({
                method: 'PUT',
                payload: invalidPresetConfig,
                url: `/config/${uuidv1()}`
            }, true);

            server.inject(request).then(function (r) {
                const statusCode = r.statusCode;
                const message = r.result.message;

                expect(statusCode).to.be.equal(400);
                expect(message).to.not.be.null;
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 404 if the uuid is not in the db', (done) => {
            const request = mergeDefaults({
                method: 'PUT',
                payload: validPresetConfig,
                url: `/config/${uuidv4()}`
            }, true);

            server.inject(request).then(function (r) {
                const statusCode = r.statusCode;
                expect(statusCode).to.be.equal(404);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
    });
    before(async () => await server.liftOff(post));
    describe('post', () => {
        it('replies 200 if provided presetConfig is valid', (done) => {
            const request = mergeDefaults({
                method: 'POST',
                payload: validPresetConfig,
                url: '/config'
            }, true);

            server.inject(request).then(function (r) {
                const isAuthenticated = r.request.auth.isAuthenticated;
                const statusCode = r.statusCode;
                const { upload, id } = r.result;
                const { error, value } = Joi.validate(id, uuidSchema);

                /**
                 * show that...
                 * - we get a 200
                 * - have authenticated w/the signed JWT
                 * - the payload gives success response and the preset's id in the db...
                 */
                expect(statusCode).to.equal(200);
                expect(isAuthenticated).to.be.true;
                expect(upload).to.eql('successful');
                expect(error).to.be.null;
                expect(value).to.eql(id);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies 400 if provided presetConfig is invalid', (done) => {
            const request = mergeDefaults({
                method: 'POST',
                payload: invalidPresetConfig,
                url: '/config'
            }, true);

            server.inject(request).then(function (r) {
                expect(r.statusCode).to.equal(400);
                done();
            }).catch(function (err) {
                throw err;
            });
        });
        it('replies message indicating first schema offense if presetConfig is invalid', (done) => {
            const request = mergeDefaults({
                method: 'POST',
                payload: invalidPresetConfig,
                url: '/config'
            }, true);

            server.inject(request).then(function (r) {
                const message = r.result.message;
                expect(message).to.not.be.null;
                done();
            }).catch(function (err) {
                throw err;
            });
        });
    });
};
