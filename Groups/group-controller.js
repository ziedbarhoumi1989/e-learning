const User = require('../User/user-controller');
const Class = require('../Classes/class-controller');
const _User = require('../User/user-model');
const _Class = require('../Classes/class-model');


const _Group = require('../Groups/group-model');
const Identifiers = require('../Groups/group-generators');
const Mongoose = require('mongoose');

const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
Mongoose.connect(config.database);

// TODO: Custom Enrolled Groups.
// TODO: Automatically Created Groups from Classes.


module.exports.createSingleGroup = (module_code, name, callback) => {

    _Class.findOne({module_code: module_code}, (error, module) => {

        if (error || module === null)
            throw new Error("Could not find class to assign group to");

        else {

            console.log(module);

            let NewGroup = new _Group({

                assignments: [],
                custom_name: name || module.module_code + " " + module.title + " - " + Identifiers.getIdentifier().name

            });

            NewGroup.save((error, group) => {

                console.log("Saving Group");

                if (error || group === null)
                    throw new Error("Could not create group");

                else {

                    console.log(module);
                    console.log(module.groups.indexOf(group._id));

                    if (module.groups.indexOf(group._id) === -1) {
                        module.groups.push(group);

                        module.save((error, updated) => {

                            if (error)
                                throw new Error("Could not update Class with new Group");

                            else
                                console.log(updated);
                        });
                    }

                    callback(null, group);

                }

            });
        }

    });
};


// TODO: Make Sure to Assign Students to a Group
module.exports.createClassGroup = (module_code, callback) => {

    Class.getEnrolledStudents(module_code, (error, students) => {

        this.createSingleGroup(module_code, null, (error, group) => {

            students.forEach(student => {

                _User.findOne({email: student.email}, (error, user) => {

                   User.joinGroup(group._id, user, (error) => {

                       if (error)
                           callback("Could not enroll student", null);

                       else
                           console.log("Enrolled Student " + student.email);
                   });

                });

            });

            callback(null, group);


        });

    });
};


module.exports.getGroupMembers = (group_id, callback) => {

    _User.find({groups: group_id}, (error, users) => {

        console.log(users);

    });

};


module.exports.getGroup = (group_id, callback) => {

    _Group.findOne({_id: group_id}, (error, group) => {

        if (error)
            callback("Could not find group ", null);

        else
            callback(null, group);

    });

};

