const _Annotation = require('./annotation-model');
const Mongoose = require('mongoose');
const Activity = require('../Activity/activity-controller');
const config = require('../Config/database');

//Mongoose.connect("localhost/Classroom-Dev-Cluster-2");
Mongoose.connect(config.database);

module.exports.getAnnotations = (callback) => {

    _Annotation.find((error, annotations) => {

        console.log(annotations);

        if(error || annotations === null)
            callback("Could not find annotations", null);

        else
            callback(null, annotations);

    });

};

module.exports.getAnnotationsByEmail = (email, activityName, taskName, callback) => {

    _Annotation.find({email:email, activity:{
    	activityName: activityName,
    	taskName: taskName }}, (error, annotations) => {

        console.log(annotations);

        if(error || annotations === null)
            callback("Could not find annotations", null);

        else
            callback(null, annotations);

    });

};

module.exports.deleteAnnotation=(text,callback)=>{

	_Annotation.deleteOne({text: text.text}, function(err, message){
		if(err){
			console.log(err);
		}
		else{
			console.log("Deleted Successfully");
		}
	})

}

module.exports.updateFeedback = (email, feedback, context, index, callback) => {

    _Annotation.findOne({email: email, index: index, context: context}, (error, annotation) => {

        if (error || annotation === null)
            callback("annotation cannot be found.", null);

        else {

            annotation.feedback.push(feedback);

            annotation.save((error, updated) => {
                if (error){

                    callback("Could not update annotation", null);
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

