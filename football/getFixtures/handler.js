'use strict';

const lib = require('../../lib/competitions.js');

module.exports.handler = function(event, context, cb) {

  lib.getFixtures(event)
      .then(fixtureData => {
        context.succeed(fixtureData);
      })
      .catch((err) => {
        console.error(err, err.stack);
        context.fail(JSON.stringify(err));
      });
};
