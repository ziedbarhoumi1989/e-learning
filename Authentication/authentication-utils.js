const Crypto = require('bcryptjs');

module.exports.generateHash = password => {
    let salt = Crypto.genSaltSync(12);
    return Crypto.hashSync(password, salt);
};

module.exports.validatePassword = (candidate, password) => {
    console.log("Comparing Passwords - " + candidate + "   " + password);
    return Crypto.compareSync(candidate, password);
};
