const User = require('../User/user-controller');
const _User = require('../User/user-model');
const _Class = require('./class-model');
const Mongoose = require('mongoose');
const AuthJWT = require('../JWT/jwt-controller');
const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
Mongoose.connect(config.database);

// TODO: FIX ERROR CHECKING

module.exports.createClass = (title, module_code, teacher,callback) => {

    _Class.findOne({module_code: module_code}, (error, module) => {

        if (module === null) {

            User.getUser(teacher.email, (error, teacher) => {
                console.log(teacher);

                let NewModule = new _Class({

                    title: title,
                    module_code: module_code,
                    teacher: teacher,
                    groups: [],
                    files: [],
                    archived: false

                });


                NewModule.save((error, module) => {
                    if (error || module === null)
                        callback("Could not create class ", null);

                    else
                    {
                 
                            teacher.classes.push(module);

                            teacher.save((error, updated) => {

                                if (error){
                                    callback("Could not update Teachers classes", null);
                                    console.log(error);
                                }
                
                                else{
                                    callback(null, module);
                                }
                            });

                        
                    }
                });
            });

        }

        else {
            callback("Class already exists", null);
        }

    });

};


module.exports.getClass = (module_code, callback) => {


    _Class.findOne({module_code: module_code},(error, module) => {


        if (error || module === null){
            console.log(error);
            callback("Cannot find Class", null);
        }

        else{
            callback(null, module);

        }
        
    });

};

module.exports.getClassById = (_id, callback) => {


    _Class.find({_id: _id})
        .populate('teacher', 'first last email university')
        .populate('groups')
        .exec((error, module) => {


        if (error || module === null){
            callback("Cannot find Class", null);
            //console.log(error);
        }

        else{
            callback(null, module);

        }
        
    });

};


module.exports.getClasses = (callback) => {


    _Class.find()
        .populate('teacher', 'first last email university')
        .populate('groups')
        .exec((error, module) => {


            if (error || module === null)
                callback("Cannot find Class", null);

            else
                callback(null, module);

        });

};




module.exports.updateClass = (module_code, obj, callback) => {

    _Class.findOne({module_code: module_code}, (error, module) => {

        if (error || module === null) {
            throw new Error("Class cannot be found.");
            console.log(error);
        }
        

        else {

            module.title = obj.title || module.title;
            module.module_code = obj.module_code || module.module_code;
            module.teacher = obj.teacher || module.teacher;
            module.groups = obj.groups || module.groups;
            module.files = obj.files || module.files;
            module.archived = false;

            module.save((error, updated) => {
                if (error)
                    throw new Error("Could not update module - " + error.stack);

                else {
                    console.log(updated);
                    callback(null, updated);
                }

            });
        }

    });

};

module.exports.archiveClass = (module_code, callback) => {

    _Class.findOneAndUpdate({module_code: module_code}, { $set: { archived: true }}, (error, updated) => {
        if (error)
            throw new Error("Could not archive class");

        else {
            console.log("Archived Class");
        }
    });
};


module.exports.getEnrolledStudents = (module_code, callback) => {

    _Class.find({module_code: module_code}, (error, module_) => {

        _User.find({classes: module_, role:"Student"}, "first last email university")
            .populate('classes').exec((error, students) => {

            if(error || students === null)
                callback("Cannot find Enrolled Students", null);

            else {
                callback(null, students);
                console.log(students);
            }

        });

        
        //console.log(module_[0].students);

    });
};
