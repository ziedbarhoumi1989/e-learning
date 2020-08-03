const Crypto = require('crypto');
const Mongoose = require('mongoose');

module.exports.generateRegistrationToken = _ => Crypto.randomBytes(15).toString("hex");
