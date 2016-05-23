'use strict';

const lib = require('../../lib/competitions.js');

module.exports.handler = function(event, context, cb) {

  lib.updateFixture(event)
      .then(fixtureData => {

          fixtureData = fixtureData.ok === 1 ? { message:"success"} : {error: "failed" };
          context.succeed(fixtureData);
      })
      .catch((err) => {
        console.error(err, err.stack);
        context.fail(JSON.stringify(err));
      });
};
