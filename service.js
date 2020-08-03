const Express = require('express');
const Parser = require('body-parser');
const RequestLogger = require('morgan');
const Mongoose = require('mongoose');
const passport = require('passport');
const UserAPI = require('./User/user-api');
const AuthAPI = require('./Authentication/authentication-api');
const ClassAPI = require('./Classes/class-api');
const GroupAPI = require('./Groups/group-api');
const UploadAPI = require('./Uploads/uploads-api');
const AnnotateAPI = require('./Annotations/annotation-api');
const ActivityAPI = require('./Activity/activity-api');
const config = require('./Config/database');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride = require('method-override');
const path = require('path');
//const MongoClient = require('mongodb').MongoClient;

const Generator = require('express-oas-generator');
//const mongoURI = "mongodb://127.0.0.1:27017/Classroom-Dev-Cluster-2"
const mongoURI = "mongodb://SeanRoo:Celtic88@classroom-shard-00-00-isery.mongodb.net:27017,classroom-shard-00-01-isery.mongodb.net:27017,classroom-shard-00-02-isery.mongodb.net:27017/test?ssl=true&replicaSet=Classroom-shard-0&authSource=admin&retryWrites=true";

Mongoose.set('debug', true);

Mongoose.connect(mongoURI, {useNewUrlParser: true})
.then(() => console.log('connecting to database successful '))
.catch(err => console.error('could not connect to mongo DB'))


let App = Express();

App.use(Parser.json());
App.use(Parser.urlencoded( {extended: true} ));
App.use(RequestLogger('dev')); // Replace with some good logging library eventually

if (process.env.NODE_ENV === 'production') {
    App.use(Express.static(path.join(__dirname , 'public')));
}
//App.use("/api", routes);

// Passport Middleware
App.use(passport.initialize());
App.use(passport.session());
require('./Config/passport')(passport);

App.use(methodOverride('_method'));



App.use(function(req, res, next) { //allow cross origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, x-api-key");
    
    next();
});





App.use('/', UserAPI);
App.use('/', AuthAPI);
App.use('/', ClassAPI);
App.use('/', GroupAPI);
App.use('/', UploadAPI);
App.use('/', AnnotateAPI);
App.use('/', ActivityAPI);

//App.use(cors());

App.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
App.get('/', (req, res) => {
    res.send('invaild endpoint');
});

Generator.init(App, {});
const port = process.env.PORT || 8080;
App.listen(port, ()=>{
    console.log("Classroom Service Started");
});
