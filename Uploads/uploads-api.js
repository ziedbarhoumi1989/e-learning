const Express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride = require('method-override');
const _Upload = require('./uploads-model');


const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
const conn = mongoose.createConnection(config.database);
//const mongoURI = "mongodb://127.0.0.1:27017/Classroom-Dev-Cluster-2";
//mongoose.connect(mongoURI);
//const conn = mongoose.createConnection(mongoURI);


let UploadAPI = Express.Router();


//init gfs
let gfs;
conn.once('open',()=>{
  gfs = Grid(conn.db, mongoose.mongo);
  //gfs.collection('uploads');
});
const storage = new GridFsStorage({
  url: config.database,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;//buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({storage});

UploadAPI.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
UploadAPI.post('/upload/image/:module_code', upload.single('file'), (req, res) => {
  var filename = req.file.filename;
  var uploadStatus = 'Uploaded Successfully';
  var uploadImg= new _Upload({
    fieldname: req.file.fieldname,
    originalname: req.file.filename,
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    module_code: req.params.module_code,
    task_title: req.body.taskName,
    task_desc: req.body.taskDesc,
    activity_name: req.body.activityName,
    task_type: req.body.taskType,
    index: req.body.index
  })
  uploadImg.save(function(err){
    if(err){
      console.log(err)
    }else{
      return req.body.originalname;
      console.log("Success");
    }
  })
});



UploadAPI.post('/upload/text/:module_code', (req, res) => {
  var uploadStatus = 'Uploaded Successfully';
  var uploadText= new _Upload({
    module_code: req.params.module_code,
    task_title: req.body.taskName,
    task_desc: req.body.taskDesc,
    activity_name: req.body.activityName,
    task_type: req.body.taskType,
    index: req.body.index
  })
  uploadText.save(function(err){
    if(err){
      console.log(err)
    }else{
      console.log("Success");
    }
  })
});

module.exports.updatetask = (student, taskname, callback) => {

    _Upload.findOne({task_title: taskname, }, (error, user) => {

        if (error || user === null)
            callback("User cannot be found.", null);

        else {

            user.first = obj.first || user.first;
            user.last = obj.last || user.last;
            user.email = obj.email || user.email;
            user.role = obj.role || user.role;
            user.classes = obj.classes || user.classes;
            user.groups = obj.groups || user.groups;
            user.files = obj.files || user.files;

            user.save((error, updated) => {
                if (error){

                    callback("Could not update user", null);
                    console.log(error);
                }

                else {
                    console.log(updated);
                    callback(null, updated);
                }
            });
        }
    });
};

// @route GET /files
// @desc  Display all files in JSON
UploadAPI.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
UploadAPI.get('/files/file=:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});


UploadAPI.get('/files/module=:module_code', (req, res) => {
  _Upload.find({module_code: req.params.module_code}, (error, file)=>{
    if (error){
            res.json({status: false, error: error});
          }
        else{
            return res.json(file);
          }
  //console.log(data);
  });
});

UploadAPI.get('/files/:activityname/:tasktitle', (req, res) => {
  _Upload.find({'$and': [{activity_name : req.params.activityname}, {task_title: req.params.tasktitle}]}, (error, file)=>{
    if (error){
            res.json({status: false, error: error});
          }
            
            else{
              return res.json(file);
            }

        })});
  //console.log(data);


UploadAPI.get('/files/activityname=:activityname', (req, res) => {
  _Upload.find({activity_name: req.params.activityname}, (error, file)=>{
    if (error){
            res.json({status: false, error: error});
          }
        else{
            return res.json(file);
          }
  //console.log(data);
  });
});

UploadAPI.get('/files/id=:_id', (req, res) => {
  gfs.files.findOne({ _id: req.params._id }, (err, file) => {
    //console.log(req.file.fsId);
  // Check if file
  if (!file || file.length === 0) {
    return res.status(404).json({
      err: 'No file exists'
    });
  }
  // File exists
  return res.json(file);
});
});

// @route GET /image/:filename
// @desc Display Image
UploadAPI.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
UploadAPI.delete('/files/:originalname', (req, res) => {
  gfs.remove({ filename: req.params.originalname }, (err, gridStore) => {
    /*if (err) {
      return res.status(404).json({ err: err });
    }*/
  });
  _Upload.remove({ originalname: req.params.originalname }, function(err) {
    if (!err) {
            return res.sendStatus(204);
    }
    else {
            console.log(err);
    }
});
});

UploadAPI.delete("/tasks/delete/:activityname", (req, res) => {

    _Upload.remove({activity_name: req.params.activityname},(error, message) => {

        if (error)
            res.json({status: false, error: error});

        else
            res.json({status: true, msg: "Deleted Successfully"});

    });
});

module.exports = UploadAPI;