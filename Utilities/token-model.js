const Mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');

const RegistrationTokenSchema = new Mongoose.Schema({

    token: {
        type: String,
        unique: true
    },

    status: {
        type: String,
        enum: ['Active', 'Used', 'Expired']
    }

});

RegistrationTokenSchema.plugin(Validator, {message: 'is already in use.'});

module.exports = Mongoose.model("RegistrationToken", RegistrationTokenSchema);
