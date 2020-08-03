const Mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');
const AuthUtils = require('../Authentication/authentication-utils');

const UserSchema = new Mongoose.Schema({

        
        first: {
            type: String,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid']
        },

        last: {
            type: String,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid']
        },

        email: {

            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true
        },

        password: {

            type: String,
            required: [true, "can't be blank"]
        },

        university: {

            type: String,
            required: [true, "can't be blank"]
        },

        role: {
            type: String,
            enum: ['Administrator', 'Teacher', 'Student'],
            default: 'Student'
        },

        classes: [{
            type: Mongoose.Schema.Types.ObjectId, ref: 'Class'
        }],

        groups: [{
            type: Mongoose.Schema.Types.ObjectId, ref: 'Group'
        }],

        submissions: [{
                activityName: String,
                taskName: String,
                submitted: Boolean,
                count: Number,
                content: String
            
        }],

    },

    {
        timestamps: true,
        usePushEach: true
    });


UserSchema.plugin(Validator, {message: 'is already taken.'});

/*

UserSchema.methods.hashPassword = function (password) {
    this.password = AuthUtils.generateHash(password);
};

UserSchema.methods.validatePassword = function (candidate) {
    return AuthUtils.validatePassword(candidate, this.password);
};

*/

module.exports = Mongoose.model("User", UserSchema);


