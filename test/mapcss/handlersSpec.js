'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mergeDefaults = require('../mergeDefaults');
const post = require('../../routes/mapcss').post;
const validMapCss = ['way[amenity=clinic][!healthcare]:closed{'
    + 'throwError: "Health Clinic preset must include healthcare"; }'];

const invalidMapCss = [
    `line[emergency=permissive] {
        throwWarning: tr("{0} makes no sense", "{0.tag");
        fixAdd: "emergency=yes";
        assertMatch: "way emergency=permissive";
        assertNoMatch: "way emergency=designated";
    }`,
    'way[highway][name =~ /Rodovia ([A-Z]{2,3}-[0-9]{2,4}/] {throwWarning: tr("test");}'
];


module.exports = () => {
    before(async () => await server.liftOff(post));
    describe('post', () => {
        it ('replies 200 if provided MapCSS is valid', () => {
            validMapCss.forEach(async (mapcss) => {
                try {
                    const request = mergeDefaults({
                        method: 'post',
                        payload: mapcss,
                        headers: { 'Content-Type': 'text/plain'},
                        url: '/mapcss'
                    });
                    const r = await server.inject(request);
                    const statusCode = r.statusCode;

                    expect(statusCode).to.equal(200);
                    const expected = [
                        {
                            geometry:['closedway'],
                            equals: {
                                amenity:'clinic'
                            },
                            absence: 'healthcare',
                            error: '{ Health Clinic preset must include healthcare }'
                        }
                    ];
                    expect(JSON.parse(r.payload)).to.eql(expected);
                } catch (e) {
                    console.log(e);
                }
            });
        });
        it('replies 400 if provided MapCSS is invalid', () => {
            invalidMapCss.forEach(async (mapcss) => {
                try {
                    const request = mergeDefaults({
                        method: 'post',
                        payload: mapcss,
                        headers: { 'Content-Type': 'text/plain'},
                        url: '/mapcss'
                    });
                    const r = await server.inject(request);
                    const statusCode = r.statusCode;
                    expect(statusCode).to.equal(400);
                    return;
                } catch (e) {
                    console.log(e);
                    return;
                }
            });
        });
    });
};