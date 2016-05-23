/**
 * Created by pawanputhran on 22/05/2016.
 */

'use strict';

const Promise     = require('bluebird');
const AWS         = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

const kms         = Promise.promisifyAll(new AWS.KMS());
const MongoDB     = Promise.promisifyAll(require("mongodb"));
const mongoClient = Promise.promisifyAll(MongoDB.MongoClient);

// to be initialized the first time the lambda is called
// using the AWS KMS to decrypt the encrypted connection
// string in the env variables
var mongoUri, mongoDb;

function decryptMongoConnString() {
    if (mongoUri !== undefined) {
        return Promise.resolve(mongoUri);
    }

/*
     let encryptedConnString = new Buffer(process.env.MONGODB, 'base64');

    let cipherText = { CiphertextBlob: encryptedConnString };


    return kms
        .decryptAsync(cipherText)
        .then(data => {
            mongoUri = data.Plaintext.toString('ascii');
            return mongoUri;
        });
*/

    return Promise.resolve("mongodb://playabl:playabl@ds011382.mlab.com:11382/playabl");
}

function connectToMongoDB () {
    if (mongoDb !== undefined) {
        return Promise.resolve(mongoDb);
    }

    return decryptMongoConnString()
        .then(conn => mongoClient.connectAsync(conn))
        .then(db => {
            console.log("connected to MongoDB");
            db.on('close', () => console.log("disconnected from MongoDB"));
            mongoDb = db;
            return db;
        });
}

module.exports.connectToMongoDB = connectToMongoDB;
