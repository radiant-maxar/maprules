'use strict';

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const mergeDefaults = require('../helpers').mergeDefaults;
const post = require('../../routes/mapcss').post;
const validMapCss = 'way[amenity=clinic][!healthcare]:closed{'
    + 'throwError: "Health Clinic preset must include healthcare"; }';

const invalidMapCss = [
    `*[emergency=permissive] {
        throwWarning: tr("{0} makes no sense", "{0.tag");
        fixAdd: "emergency=yes";
        assertMatch: "way emergency=permissive";
        assertNoMatch: "way emergency=designated";
    }`,
    'way[highway][name =~ /Rodovia ([A-Z]{2,3}-[0-9]{2,4}/] {throwWarning: tr("test");}'
];


module.exports = () => {
    before(async() => await server.liftOff(post));
    describe('post', () => {
        it('replies 200 if provided MapCSS is valid', function(done) {
            const request = mergeDefaults({
                method: 'post',
                payload: validMapCss,
                headers: { 'Content-Type': 'text/plain' },
                url: '/mapcss'
            }, true);

            server.inject(request).then(function(r) {
                const statusCode = r.statusCode;

                expect(statusCode).to.equal(200);
                const expected = [
                    {
                        geometry: 'closedway',
                        equals: {
                            amenity: 'clinic'
                        },
                        absence: 'healthcare',
                        error: '{ Health Clinic preset must include healthcare }'
                    }
                ];
                expect(JSON.parse(r.payload)).to.eql(expected);
                done();
            });
        });
        it('replies 400 if provided MapCSS is invalid', (done) => {
            let requests = invalidMapCss.map(function(mapcss) {
                const request = mergeDefaults({
                    method: 'post',
                    payload: mapcss,
                    headers: { 'Content-Type': 'text/plain' },
                    url: '/mapcss'
                }, true);

                return server.inject(request);
            });

            Promise.all(requests)
                .then(function(results) {
                    results.forEach(function(r) {
                        const { statusCode, error, message } = r.result;

                        expect(statusCode).to.eql(400);
                        expect(error).to.eql('Bad Request');
                        expect(message).to.eql('provided mapcss is invalid');
                    });
                    done();
                })
                .catch(function(error) {
                    throw error;
                });
        });
    });
};

