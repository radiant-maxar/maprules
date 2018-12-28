'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mergeDefaults = require('../mergeDefaults');
const post = require('../../routes/mapcss').post;
const validMapCss = [
    require('../../testData/mapCSS/osm/valid.validator.mapcss')
];

const invalidMapCss = [
    require('../../testData/mapCSS/osm/invalid.validator.mapcss')
];
module.exports = () => {
    before(async () => await server.liftOff(post));
    describe('post', () => {
        it ('replies 200 if provided MapCSS is valid', async () => {
            validMapCss.forEach(async (mapcss) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: mapcss,
                    url: '/mapcss'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
            });
        });
        it('replies 400 if provided MapCSS is invalid', async () => {
            invalidMapCss.forEach(async (mapcss) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: mapcss,
                    url: '/mapcss'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(400);
            });
        });
    });
};