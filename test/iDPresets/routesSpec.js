'use strict';

const Joi = require('@hapi/joi');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const uuidv4 = require('uuid/v4');
const seeds = require('../../testData/seeds');
const id = seeds.presets[0].id;
const mergeDefaults = require('../helpers').mergeDefaults;
const get = require('../../routes/iDPresets').get;

module.exports = () => {
    before(async () => await server.liftOff(get));
    describe('get', () => {
        it('returns 200 and an idPresets json if id in db', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${id}/presets/iD`
                }),
                r = await server.inject(request),
                iDPresets = r.result,
                statusCode = r.statusCode;

            expect(statusCode).to.equal(200);
            expect(iDPresets).not.to.be.null;

        });
        it('returns 404 if id not in database', async () => {
            const request = mergeDefaults({
                    method: 'GET',
                    url: `/config/${uuidv4()}/presets/iD`
                }),
                r = await server.inject(request),
                statusCode = r.statusCode;


            expect(statusCode).to.equal(404);

        });
    });
};
