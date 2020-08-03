// TODO: ADD ERROR CHECKING.
// TODO: STOP THROWING ERRORS.

const _User = require('./user-model');
const Mongoose = require('mongoose');
const AuthUtils = require('../Authentication/authentication-utils');
const AuthJWT = require('../JWT/jwt-controller');
const _RegistrationToken = require('../Utilities/token-model');
const Class = require('../Classes/class-controller');
const _Class = require('../Classes/class-model');
const Group = require('../Groups/group-controller');
const _Group = require('../Groups/group-model');
const bcrypt = require('bcryptjs');

const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
Mongoose.connect(config.database);


// TODO: Add Callback Handle
// module.exports.createTeacher = (name, email, password, university, otp, callback) => {

//     // OTP = One Time Password for Registration

//     _RegistrationToken.findOne({token: otp}, (error, token) => {

//         if (error || token === null) {
//             callback("Token not valid", null);
//         }

//         else if (token.status === "Used" || token.status === "Expired") {
//             callback("Token not valid", null);
//         }

//         else {

//             _User.findOne({email: email}, (error, user) => {

//                 if (user === null) {


//                     let RegisteredTeacher = new _User({

//                         name: name,
//                         email: email,
//                         password: AuthUtils.generateHash(password),
//                         university: university,
//                         role: "Teacher",
//                         classes: [],
//                         groups: [],
//                         files: []
//                     });

//                     RegisteredTeacher.save((error, teacher) => {

//                         if (error || teacher === null)
//                             callback("Teacher could not be created", null);

//                         else {
//                             token.update({status: 'Used'}, (error) => {
//                                 if (error)
//                                     callback("Token status could not be updated", null);

//                                 else {
//                                     console.log("Updated Token Status");
//                                     callback(null, teacher)
//                                 }
//                             });
//                         }

//                     });
//                 }

//                 else
//                     callback("Teacher already exists", null);
//             });
//         }
//     });

// };


// TODO: Send Email to User with Generated Password/

module.exports.createTeacher = (first, last, email, password, university, callback) => {

    _User.findOne({email: email}, (error, user) => {

        if (user === null) {


            let RegisteredTeacher = new _User({

                first: first,
                last: last,
                email: email,
                password: AuthUtils.generateHash(password),
                university: university,
                role: "Teacher",
                classes: [],
                groups: [],
                submissions: []
            });

            RegisteredTeacher.save((error, teacher) => {

                if (error || teacher === null)
                    callback("Teacher could not be created", null);

                else
                    callback(null, teacher);
            });
        }

        else
            callback("Teacher already exists", null);
    });
};
module.exports.createStudent = (first, last, email, password, university, callback) => {

    _User.findOne({email: email}, (error, user) => {

        if (user === null) {


            let RegisteredStudent = new _User({

                first: first,
                last: last,
                email: email,
                password: AuthUtils.generateHash(password),
                university: university,
                classes: [],
                groups: [],
                tasks: [{
                }],
                submissions: []
            });

            RegisteredStudent.save((error, student) => {

                if (error || student === null)
                    callback("Student could not be created", null);

                else
                    callback(null, student);
            });
        }

        else
            callback("Student already exists", null);
    });
};


// TODO: Return the User through the callback.
// TODO: Add Populate for Classes, Groups and other arrays.
module.exports.getUser = (email, callback) => {

    _User.findOne({email: email})
        .populate('classes')
        .populate('groups')
        .populate('students')
        .exec((error, user) => {

            if (error || user === null)
                callback("User could not be found", null);
            else {
                callback(null, user);
            }

        });
};

module.exports.getUserById = function(id, callback) {
  _User.findById(id, callback);
}


module.exports.getStudents = (callback) => {

    _User.find({role: "Student"}, (error, users) => {

        console.log(users);

        if(error || users === null)
            callback("Could not find Students", null);

        else
            callback(null, users);

    });

};



module.exports.getTeachers = (callback) => {

    _User.find({role: "Teacher"}, (error, users) => {

        if(error || users === null)
            callback("Could not find Teachers", null);

        else
            callback(null, users);

    });

};


module.exports.getAdmins = (callback) => {

    _User.find({role: "Admin"}, (error, users) => {

        if(error || users === null)
            callback("Could not find Admins", null);

        else
            callback(null, users);

    });

};


module.exports.getAll = (callback) => {

    _User.find((error, users) => {

        if(error || users === null)
            callback("Could not find Users", null);

        else
            callback(null, users);

    });

};
// TODO: Return the User through the callback.
module.exports.updateUser = (email, obj, callback) => {

    _User.findOne({email: email}, (error, user) => {

        if (error || user === null)
            callback("User cannot be found.", null);

        else {

            user.first = obj.first || user.first;
            user.last = obj.last || user.last;
             //user.email = obj.email;
            // user.role = obj.role || user.role;
            // user.classes = obj.classes || user.classes;
            // user.groups = obj.groups || user.groups;
            // user.submissions = obj.submissions || user.submissions;

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

module.exports.updateSubmissions = (email, sub, callback)=>{
    console.log(email);
    _User.findOne({email: email}, (error, user)=>{
        if(error || user==null)
            callback("User cannot be found.", null);

        else{
            user.submissions.push(sub);
            user.save((error, user) => {

                            if (error) {
                                callback("Could not update user", null);
                            }

                            else {
                                console.log("Updated!");
                                callback(null, user);
                            }

                        });
        }
    })
}



// TODO: Add Enrollment into Classes (Once Classes are done)

module.exports.enroll = (module_code, obj, callback) => {

    _User.findOne({email: obj.email}, (error, user) => {

        if (error || user === null)
            callback("Could not find User", null);

        else {

            _Class.findOne({module_code: module_code}, (error, module) => {

                if (error || module === null)
                    callback("Could not find Module", null);

                else {

                    if (user.classes.indexOf(module._id) > -1) {
                        callback("User is already enrolled", null);
                    }

                    else {

                        user.classes.push(module);
                        user.save((error, user) => {

                            if (error) {
                                callback("Could not enroll user", null);
                                console.log(error);
                            }

                            else {
                                console.log("User " + user.email + " enrolled in " + module.title);
                                callback(null, user);
                            }

                        });

                        module.students.push(user);
                        module.save((error, module) => {

                            if (error) {
                                callback("Could not add user to class", null);
                                console.log(error);
                            }

                            else {
                                console.log("Student " + user.email + " has been added to " + module.title);
                                //callback(null, module);
                            }

                        });
                    }
                }
            });
        }
    });
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}


module.exports.joinGroup = (group_id, obj, callback) => {

    _User.findOne({email: obj.email}, (error, user) => {

        if (error || user === null)
            callback("Could not find User to enroll", null);

        else {

            _Group.findOne({_id: group_id}, (error, group) => {

                if (error || group === null)
                    callback("Cannot find group", null);

                else {

                    if (user.groups.indexOf(group._id) > -1) {
                        callback("User is already enrolled", null);
                    }

                    else {

                        user.groups.push(group);
                        user.save((error, user) => {

                            if (error) {
                                callback("Could not enroll user", null);
                            }

                            else {
                                console.log("User " + user.email + " enrolled in " + group.custom_name);
                                callback(null, user);
                            }

                        });

                    }

                }

            });

        }
    });

};