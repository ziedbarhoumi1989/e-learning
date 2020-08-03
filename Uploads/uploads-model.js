const mongoose = require('mongoose');
const Validator = require('mongoose-unique-validator');

var taskSchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimeptype: String,
  path: String,
  size: Number,
  created_at: Date,
  updated_at: Date,
  module_code: String,
  task_desc: String,
  task_title: String,
  activity_name: String,
  task_type: String,
  index: Number
},
{ collection: 'tasks',
  usePushEach: true }
);
//var Image = mongoose.model('Image', imageSchema);

module.exports = mongoose.model("Task", taskSchema);