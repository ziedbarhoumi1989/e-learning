const Mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');


// Annotation Ranges

var Shape = new Mongoose.Schema([{
    type: {
        type: String,
        required: true
    },
    geometry: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    }
}]);
var Student = new Mongoose.Schema([{
    email: {
        type: String,
        required: true
    },
    name: {

        first:{
            type: String,
            required: true
        },
        last:{
            type: String,
            required: true
        }
    }
}]);
var Annotation = new Mongoose.Schema({
   email:{
       type: String
   },
   name:{
       first: {
           type: String
       },
       last: {
           type: String
       } 
   },
    src:{
        type: String,
        required: true
    },
    editable:{
        type: Boolean
    },
    text:{
        type: String,
        required: true
    },
    shapes: 
        { type: Array, ref: 'Shape'},

    context: {
        type: String,
        required: true
    },

    index:{
        type: Number,
        required: true
    },

    feedback:[{
        first: String,
        last: String,
        index: Number,
        comment: String
    }],
    activity:{
        activityName: String,
        taskName: String
    }
},
{ collection: 'annotations',
    usePushEach: true });


module.exports = Mongoose.model('Annotation', Annotation);