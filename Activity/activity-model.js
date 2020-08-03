const mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');

var activitySchema = new mongoose.Schema({
  activityName: String,
  activityType: String,
  group:{
  	type: Array
  },
  module_code: String,
  tasks: { 
    
    type: Array

        },
  comments:{
              type: Array
            
            },
 submissions:{
   type: Array
 }
},
{
        timestamps: true,
        usePushEach: true
    });

module.exports = mongoose.model("Activity", activitySchema);