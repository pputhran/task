/**
 * Created by pawanputhran on 23/05/2016.
 */

const Chance            = require('chance');
const c = new Chance();

module.exports = {
    SERVER_URL: "https://xxnzalnrf7.execute-api.eu-west-1.amazonaws.com/",
    MATCHID: "7357328",
    POST_DATA : {
        "mdate": "25/06/2018",
        "koTime": "14:00",
        "competitionID": "750",
        "stageNumber": "2",
        "stageType": "ddd",
        "roundNumber": "1",
        "roundText": "Round Of 16",
        "leg": "1",
        "homeTeamID": "8161",
        "homeText": "Runner-up Group A",
        "awayTeamID": "8165",
        "awayText": "Runner-up Group C",
        "venueID": "468",
        "venueText": "Geoffroy-Guichard",
        "referee": null
    },
    PUT_DATA : {
        "koTime": "1:00",
        "venueID": c.string({pool: '123456789',length: 3 }),
        "venueText": "Kings Cross"
    }
};
