'use strict';

/**
 * Created by pawanputhran on 21/05/2016.
 */

const co                = require('co');
const connectToMongoDB  = require('./mongo').connectToMongoDB;
const Chance            = require('chance');

module.exports.getCompetitions = co.wrap(function*(event) {

    const db = yield connectToMongoDB();

    // returns an array of competitions sorted by the startDate
    
    const seasons = yield db
        .collection('competitions')
        .find({})
        .sort({'startDate':1})
        .toArray();
    
    return seasons;

});

module.exports.getFixtures = co.wrap(function*(event) {

    const db = yield connectToMongoDB();

    let query;

    if (event.competitionID){
        query = { '@competitionID' : event.competitionID };
    }

    // returns an array of fixtures for a particular competition

    const fixtures = yield db
        .collection('fixtures')
        .find(query)
        .toArray();

    return fixtures;

});

module.exports.postFixture = co.wrap(function*(event) {

    const db = yield connectToMongoDB();

    let c = new Chance(34565788);

    const body = event.body;

    // inserts a new fixture

    const record = {
        '@matchID'          : c.string({pool: '123456789',length: 7
        }),
        '@date'             : body.mdate,
        '@koTime'           : body.koTime,
        '@competitionID'    : body.competitionID,
        'stage'             : {
            '@stageNumber'  : body.stageNumber,
            '@stageType'    : body.stageType
        },
        'round'             : {
            '@roundNumber'  : body.roundNumber,
            '#text'         : body.roundText,
        },
        'leg'               : body.leg,
        'homeTeam'          : {
            '@teamID'       : body.homeTeamID,
            '#text'         : body.homeText
        },
        'awayTeam'          : {
            '@teamID'       : body.awayTeamID,
            '#text'         : body.awayText
        },
        'venue': {
            '@venueID'      : body.venueID,
            '#text'         : body.venueText
        },
        'referee'           : body.referee || null
    };

    const newFixture = yield db
        .collection('fixtures')
        .insertOne(record);

    return newFixture;

});

module.exports.updateFixture = co.wrap(function*(event) {

    const db = yield connectToMongoDB();

    console.log(event.matchID);
    const body = event.body;

    // a sample to update the venue and match kick-off time.
    // this can be extended to update any other values based on business requirement

    const updateFixture = yield db
        .collection('fixtures')
        .findOneAndUpdate(
            {
                '@matchID' : event.matchID
            },
            { $set : {
                '@koTime'           : body.koTime,
                'venue': {
                    '@venueID'      : body.venueID,
                    '#text'         : body.venueText
                    }
                }
            }
        )
    
    return updateFixture;

});

module.exports.deleteFixture = co.wrap(function*(event) {

    const db = yield connectToMongoDB();

    const condition = {
        '@matchID' : event.matchID
    };

    const data = {
        $set:  {
            state: "deleted",
            deleted_at: new Date()
        }
    }

    const deleteFixture = yield db
        .collection('fixtures')
        .findOneAndUpdate( condition, data);

    return deleteFixture;

});