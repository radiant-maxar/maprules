'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mergeDefaults = require('../mergeDefaults');
const post = require('../../routes/mapcss').post;
const validMapCss = ['way[amenity=clinic][!healthcare]:closed{'
    + 'throwError: "Health Clinic preset must include healthcare";}'];

const invalidMapCss = ['way[highway][name =~ /Rodovia ([A-Z]{2,3}-[0-9]{2,4}/] {throwWarning: tr("test");}'];


module.exports = () => {
    before(async () => await server.liftOff(post));
    describe('post', () => {
        it ('replies 200 if provided MapCSS is valid', async () => {
            validMapCss.forEach(async (mapcss) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: mapcss,
                    headers: { 'Content-Type': 'text/plain'},
                    url: '/mapcss'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
                const expected = JSON.parse('[{"geometry":"closedway","equals":{"amenity":"clinic"},"absence":"healthcare","error":"{ Health Clinic preset must include healthcare}"}]');
                expect(JSON.parse(r.payload)).to.eql(expected)
            });
        });
        it('replies 400 if provided MapCSS is invalid', async () => {
            invalidMapCss.forEach(async (mapcss) => {
                const request = mergeDefaults({
                    method: 'post',
                    payload: mapcss,
                    headers: { 'Content-Type': 'text/plain'},
                    url: '/mapcss'
                });
                const r = await server.inject(request);
                const statusCode = r.statusCode;
                expect(statusCode).to.equal(400);
            });
        });
    });
};