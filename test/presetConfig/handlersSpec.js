'use strict';

const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');
const presetConfigSchema = require('../../schemas').presetConfig;
const mergeDefaults = require('../mergeDefaults'); 
const seedId = require('../../testData/seeds')[0].id;

const get = require('../../routes/presetConfig').get;
const put = require('../../routes/presetConfig').put;
const post = require('../../routes/presetConfig').post;

const validPresetConfigs = [
    require('../../testData/presetConfig/osm/valid.json')
];

const invalidPresetConfigs = [
    require('../../testData/presetConfig/osm/invalid.json')
];


module.exports = () => {
    before(async () => await server.liftOff(get));
    describe('get', () => {
        it('replies 200 and presetConfig provided uuid that exists in the db', async () => {
            try {
                const request = mergeDefaults({ 
                    method: 'GET',
                    url: `/config/${seedId}`
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;
                const presetConfig = r.result;
                const validation = Joi.validate(presetConfig, presetConfigSchema);
                expect(statusCode).to.equal(200);
                expect(validation.error).to.be.null;
              
            } catch (error) {
                console.error(error);

            }
        });
        it('replies 400 if uuid is invalid', async () => {
            try {
                const request = mergeDefaults({ 
                    method: 'GET',
                    url: `/config/${uuidv1()}`
                });
                const r = await server.inject(request);

                expect(r.statusCode).to.equal(400);

            } catch (error) {
                console.error(error);
            }
        });
        it('replies 404 if the the uuid is not in the db', async () => {
            try {
                const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${uuidv4()}`
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(r.statusCode).to.equal(404);
            } catch (error) {
                console.error(error);

            }
        });
    });
    before(async () => await server.liftOff(put));
    describe('put', () => {
        it('replies 200 when the uuid exists in db and presetConfig is valid', async () => {
            validPresetConfigs.forEach(async (validPresetConfig) => {
                try {
                    const request = mergeDefaults({
                        method: 'PUT',
                        payload: validPresetConfig,
                        url: `/config/${seedId}`
                    });
                    const r = await server.inject(request);
                        
                    expect(r.statusCode).to.equal(200);
                
                } catch (error) {
                    console.error(error);

                }
            });
        });
        it('replies 400 if the presetConfig is invalid', () => {
            invalidPresetConfigs.forEach(async (invalidPresetConfig) => {
                try {
                    const request = mergeDefaults({
                        method: 'PUT',
                        payload: invalidPresetConfig,
                        url: `/config/${seedId}`
                    });
                    const r = await server.inject(request);
                    const statusCode = r.statusCode;
                    const message = r.result.message;

                    expect(statusCode).to.be.equal(400);
                    expect(message).to.not.be.null;
                } catch (error) {
                    console.error(error);

                }
            });
        });
        it('replies 400 if the uuid is invalid', async () => {
           
            invalidPresetConfigs.forEach(async (invalidPresetConfig) => {
                try {
                    const request = mergeDefaults({
                        method: 'PUT',
                        payload: invalidPresetConfig,
                        url: `/config/${uuidv1()}`
                    });
                    const r = await server.inject(request);
                    const statusCode = r.statusCode;
                    const message = r.result.message;

                    expect(statusCode).to.be.equal(400);
                    expect(message).to.not.be.null;

                } catch (error) {
                    console.error(error);

                }
            });
        });
        it('replies 404 if the uuid is not in the db', async () => {
            validPresetConfigs.forEach(async (validPresetConfig) => {
                try {
                    const request = mergeDefaults({
                        method: 'PUT',
                        payload: validPresetConfig,
                        url: `/config/${uuidv4()}`
                    });
                    const r = await server.inject(request);
                    const statusCode = r.statusCode;

                    expect(statusCode).to.be.equal(404);

                } catch (error) {
                    console.error(error);
                }
            });
        });
    });
    before(async () => await server.liftOff(post));
    describe('post', () => {
        it ('replies 200 if provided presetConig is valid', async () => {
            validPresetConfigs.forEach(async (validPresetConfig) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: validPresetConfig,
                    url: '/config'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
            });
        });
        it('replies 400 if provided presetConfig is invalid', async () => {
            invalidPresetConfigs.forEach(async (invalidPresetConfig) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: invalidPresetConfig,
                    url: '/config'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(400);
            });
        });
        it('replies message indicating first schema offense if presetConfig is invalid', () => {
            invalidPresetConfigs.forEach(async (invalidPresetConfig) => {
                try {
                    const request = mergeDefaults({
                        method: 'post',
                        payload: invalidPresetConfig,
                        url: '/config'
                    });
                    const r = await server.inject(request);
                    const message = r.result.message;
                    
                    expect(message).to.not.be.null;

    			} catch (error) {
                    console.error(error);
                }
            });
        });
    });
};
