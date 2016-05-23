'use strict';

const lib = require('../../lib/competitions.js');

module.exports.handler = function(event, context) {
  
  lib.getCompetitions(event)
      .then(competitionData => {
        context.succeed(competitionData);
      })
      .catch((err) => {
        console.error(err, err.stack);
        context.fail(JSON.stringify(err));
      });
};

