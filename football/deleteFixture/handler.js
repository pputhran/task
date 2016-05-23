'use strict';

const lib = require('../../lib/competitions.js');

module.exports.handler = function(event, context, cb) {

  lib.deleteFixture(event)
      .then(respData => {

          respData = respData.ok === 1 ? { message:"success"} : {error: "failed" };
          context.succeed(respData);
      })
      .catch((err) => {
        console.error(err, err.stack);
        context.fail(JSON.stringify(err));
      });
};
