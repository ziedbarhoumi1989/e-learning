const _Activity = require('./activity-model');
const _User = require('../User/user-model');
const Mongoose = require('mongoose');
const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
Mongoose.connect(config.database);

module.exports.createActivity = (name, type, group, module_, tasks, callback) => {

    _Activity.findOne({activityName: name}, (error, activity) => {

        if (activity === null) {

            let createdActivity = new _Activity({

                activityName: name,
                activityType: type,
                group: group,
                module_code: module_,
                tasks: tasks,

            });

            createdActivity.save((error, activity) => {

                if (error || activity === null)
                    callback("Activity could not be created", null);

                else
                    callback(null, activity);
            });
        }

        else
            callback("Activity already exists", null);
    });
};

module.exports.deleteActivity = (activityName, obj, callback)=>{
    _Activity.deleteOne({ activityName: activityName }, function(err, message) {
    if (!err) {
            console.log("Deleted");
    }
    else {
           callback("Activity could not be deleted", null);
    }
});
}

module.exports.addTask = (activityName, obj, callback) => {

    _Activity.findOne({activityName: activityName}, (error, activity) => {

        if (error || activity === null) {
            throw new Error("Activity cannot be found.");
            console.log(error);
        }
        

        else {

            activity.activityName = obj.activityName || activity.activityName;
            activity.activityType = obj.activityType || activity.activityType;
            activity.tasks = obj.tasks || activity.tasks;

            activity.save((error, updated) => {
                if (error)
                    throw new Error("Could not update activity - " + error.stack);

                else {
                    console.log(updated);
                    callback(null, updated);
                }

            });
            console.log("found");
        }

    });

};

module.exports.getActivity = (name, callback) => {

    _Activity.findOne({activityName: name})
        //.populate('tasks')
        .exec((error, activity) => {

            if (error || activity === null)
                callback("Activity could not be found", null);
            else {
                callback(null, activity);
            }

        });
};

module.exports.getActivityByModule = (module, callback) => {

    _Activity.find({module_code: module})
        //.populate('tasks')
        .exec((error, activity) => {

            if (error || activity === null)
                callback("Activity could not be found", null);
            else {
                callback(null, activity);
            }

        });
};

module.exports.getActivities = (callback) => {

    _Activity.find((error, activities) => {

        if(error || activities === null)
            callback("Could not find Activities", null);

        else
            callback(null, activities);

    });

};

module.exports.getSubmissions = (activityName, callback) => {

    _Activity.findOne({activityName: activityName})
        .exec((error, activity) => {

        if(error || activity === null)
            callback("Could not find Submissions", null);

        else
            callback(null, activity.submissions);

    });

};
module.exports.getComments = (activityName, callback) => {

    _Activity.findOne({activityName: activityName})
        .exec((error, activity) => {

        if(error || activity === null)
            callback("Could not find Comments", null);

        else
            callback(null, activity.comments);

    });

};



module.exports.updateSubmissions = (activityname, sub, callback)=>{
    _Activity.findOne({activityName: activityname}, (error, activity)=>{
        if(error || activity==null)
            callback("Activity cannot be found.", null);

        else{
            activity.submissions.push(sub);
            activity.save((error, activity) => {

                            if (error) {
                                callback("Could not update activity", null);
                            }

                            else {
                                console.log("Submissions Updated!");
                                callback(null, activity);
                            }

                        });
        }
    })
}
module.exports.updateComments = (activityname, comment, callback)=>{
    _Activity.findOne({activityName: activityname}, (error, activity)=>{
        if(error || activity==null)
            callback("Activity cannot be found.", null);

        else{
            activity.comments.push(comment);
            activity.save((error, activity) => {

                            if (error) {
                                callback("Could not update activity", null);
                            }

                            else {
                                console.log("Comments Updated!");
                                callback(null, activity);
                            }

                        });
        }
    })
}
