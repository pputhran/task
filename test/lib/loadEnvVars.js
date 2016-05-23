'use strict';

/**
 * Created by pawanputhran on 23/05/2016.
 */

const stage  = process.env.STAGE;
const region = process.env.REGION;

module.exports = () => {
    let envVars = require(`../../_meta/variables/s-variables-${stage}-${region.split('-').join('')}.json`);
    return Promise.resolve(envVars);
};
