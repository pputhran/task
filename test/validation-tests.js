/**
 * Created by pawanputhran on 23/05/2016.
 */

'use strict';

const stage  = process.env.STAGE;
const region = process.env.REGION;

const AWS = require('aws-sdk');
AWS.config.update({ region: region });

const co                = require('co');
const Promise           = require('bluebird');
const expect            = require('chai').expect;
const loadEnvVars       = require('./lib/loadEnvVars');
const superagent        = require('superagent');
const common            = require('./lib/common');
const connectToMongoDB  = require('./lib/mongo').connectToMongoDB

describe(`Validation Test (${stage})`, () => {

    before(() =>
        loadEnvVars()
            .then(envVars => {
                process.env.MONGODB = envVars.mongodb;
            })
    );

    describe("GET", () => {

        it('Should get the list of football competitions', function (done) {

            superagent.get(common.SERVER_URL + `/${stage}/football/competitions`)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    expect(res.body.length).to.eql(6);
                    done();
                });
        });
    });

    describe("POST", () => {

        it('Should create a new fixture', function (done) {
            
            superagent.post(common.SERVER_URL + `/${stage}/football/fixture`)
                .send(common.POST_DATA)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    done();
                });
        });
    });
    
    describe("PUT", () => {

        it('Should update an existing fixture', function (done) {

            superagent.put(common.SERVER_URL + `/${stage}/football/fixture/${common.MATCHID}`)
                .send(common.PUT_DATA)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);

                    connectToMongoDB()
                        .then(db => {

                            return db.collection('fixtures')
                                .find({'@matchID':`${common.MATCHID}`})
                                .toArray()
                                .then(fixtures => {

                                    expect(fixtures[0].venue['@venueID']).to.be.eql(common.PUT_DATA.venueID);
                                    done();
                                })
                        })                   
                });
        });
    });

    describe("DELETE", () => {

        it('Should delete an existing fixture', function (done) {

            superagent.del(common.SERVER_URL + `/${stage}/football/fixture/${common.MATCHID}`)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);

                    connectToMongoDB()
                        .then(db => {

                            return db.collection('fixtures')
                                .find({'@matchID':`${common.MATCHID}`})
                                .toArray()
                                .then(fixtures => {

                                    expect(fixtures[0].state).to.be.eql("deleted");
                                    done();
                                })
                        })
                });
        });
    });
});