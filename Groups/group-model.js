const Mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');
const AuthUtils = require('../Authentication/authentication-utils');

const GroupSchema = new Mongoose.Schema({



    assignments: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],

    custom_name: {
        type: String,
        required: false,
        default: ""
    }

});

GroupSchema.plugin(Validator, {message: 'is already taken.'});

module.exports = Mongoose.model("Group", GroupSchema);
