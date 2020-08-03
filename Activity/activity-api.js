const Express = require('express');
const mongoose = require('mongoose');
// const crypto = require('crypto');
// const multer = require('multer');
// const GridFsStorage=require('multer-gridfs-storage');
// const Grid=require('gridfs-stream');
// const methodOverride = require('method-override');
const Activity = require('../Activity/activity-controller');

let ActivityAPI = Express.Router();

ActivityAPI.post('/activity/create', (req, res) => {

    let data = req.body;

    Activity.createActivity(data.activityName, data.activityType, data.group, data.module_code, data.tasks, (error, activity) => {

        res.json(activity);

    });

});
ActivityAPI.put('/:activityname/task', (req, res)=>{


	Activity.addTask(req.params.activityname, req.body, (error, activity)=>{

		res.json(activity);
		if(error){
            console.log(error);
        }
	});
});

ActivityAPI.get("/activity/:activityname", (req, res) => {

    Activity.getActivity(req.params.activityname, (error, activity) => {

        if (error || activity === null)
            res.json({status: false, error: error});

        else
            res.json(activity);

    });
});

ActivityAPI.get("/activity/module/:module", (req, res) => {

    Activity.getActivityByModule(req.params.module, (error, activity) => {

        if (error || activity === null)
            res.json({status: false, error: error});

        else
            res.json(activity);

    });
});


ActivityAPI.get("/activities/all", (req, res) => {

    Activity.getActivities ((error, activities) => {

        if (error || activities === null)
            res.json({status: false, error: error});

        else
            res.json(activities);

    });
});

ActivityAPI.get("/activity/group/:activityname/submissions", (req, res) => {

    Activity.getSubmissions (req.params.activityname,(error, submissions) => {

        if (error || submissions === null)
            res.json({status: false, error: error});

        else
            res.json(submissions);

    });
});
ActivityAPI.get("/activity/group/:activityname/comments", (req, res) => {

    Activity.getComments (req.params.activityname,(error, comments) => {

        if (error || comments === null)
            res.json({status: false, error: error});

        else
            res.json(comments);

    });
});
ActivityAPI.delete("/activity/delete/:activityname", (req, res) => {

    Activity.deleteActivity (req.params.activityname,(error, message) => {

        if (error)
            res.json({status: false, error: error});

        else
            res.json({status: true, msg: "Deleted Successfully"});

    });
});

ActivityAPI.put("/activity/submissions/update", (req,res)=>{

    Activity.updateSubmissions(req.body.activityname, req.body.submission, (error, success)=>{

        res.json(success);

        if(error){
            console.log(error);
        }
    });
});
ActivityAPI.put("/activity/comments/update", (req,res)=>{

    Activity.updateComments(req.body.activityName, req.body.comment, (error, success)=>{

        res.json(success);

        if(error){
            console.log(error);
        }
    });
});


module.exports = ActivityAPI;
