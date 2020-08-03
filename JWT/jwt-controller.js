const JWT = require('jsonwebtoken');
const FileSystem = require('fs');

let Certificate = FileSystem.readFileSync('./JWT/key.priv');
let Verfication = FileSystem.readFileSync('./JWT/key.pub');

module.exports.generateJWT = function (user) {

    let today = new Date();
    let expiry = new Date(today);

    expiry.setDate(today.getDate() + 60);

    return JWT.sign({ id: user._id, email: user.email, expiry: parseInt(expiry.getTime() / 1000)}, Certificate, {
        algorithm: 'RS256'
    });
};

module.exports.generateAuthJson = function (user) {
    return { email: user.email, token: this.generateJWT(user), image: user.image };
};
