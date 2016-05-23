'use strict';

const lib = require('../../lib/competitions.js');

module.exports.handler = function(event, context) {

  lib.postFixture(event)
      .then(newData => {
          context.succeed(newData);
      })
      .catch((err) => {
        console.error(err, err.stack);
        context.fail(JSON.stringify(err));
      });
};
