const Mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');

const ClassSchema = new Mongoose.Schema({

    title: {
        type: String,
        required: [true, "can't be blank"],
    },

    module_code: {
        type: String,
        required: [true, "can't be blank"],
        unique: true
    },

    teacher: {
        first: String,
        last: String,
        email: String
    },

    groups: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    students:[{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],

    files: [{
            type: Mongoose.Schema.Types.ObjectId, ref: 'Class-File'
        }],

    archived: {
        type: Boolean,
        default: false
    },

},
{
    usePushEach: true
});

ClassSchema.plugin(Validator, {message: 'is already used.'});


module.exports = Mongoose.model("Class", ClassSchema);