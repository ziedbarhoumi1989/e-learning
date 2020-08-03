const Express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _Annotation = require('./annotation-model');
const Anno = require('../Annotations/annotation-controller');

let AnnotateAPI = Express.Router();


AnnotateAPI.post('/annotation/create', (req, res) => {
  var uploadStatus = 'Uploaded Successfully';
  var annotation= new _Annotation({
    src: req.body.src,
    text: req.body.text,
    shapes: req.body.shapes,
    context: req.body.context,
    name: req.body.name,
    email: req.body.email,
    index: req.body.index,
    editable: req.body.editable,
    feedback: [],
    activity: req.body.activity
  })
  annotation.save(function(err){
    if(err){
      console.log(err)
    }else{
      console.log("Success");
    }
  })
});

AnnotateAPI.get('/annotations/user=:email/activity=:activityName/task=:taskName', (req, res)=>{
  let req_ = req.params;
  Anno.getAnnotationsByEmail(req_.email, req_.activityName, req_.taskName, (error, annotations)=>{
    if(error || annotations == null){
      res.json({status: false, error: error});
    }
    else{
      res.json(annotations);
    }
  })
});



AnnotateAPI.put('/annotation/feedback', (req, res) => {

    Anno.updateFeedback(req.body.email, req.body.feedback, req.body.context, req.body.index, (error, annotation) => {

        res.json(annotation);
        console.log(annotation);

        if(error){
            console.log(error);
        }

    });

});

AnnotateAPI.delete('/annotations/delete', (req, res)=>{
  Anno.deleteAnnotation({text:req.body.text}, (error, message)=>{
    if(error){
      console.log(error);
    }
    else{
      res.json(req.index);
    }
  })
 
})


AnnotateAPI.get('/annotations/', (req, res)=>{
    Anno.getAnnotations((error, annotations)=>{
        if(error || annotations == null)
            res.json({status: false, error: error});
        else
            res.json(annotations);
    });

});
// Remove an annotation
AnnotateAPI.delete('/annotations/:index',  function(req, res) {
    return _Annotation.findById(req.params.index, function(err, annotation) {
        return annotation.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send(204, 'Successfully deleted annotation.');
            } else {
                console.log(err);
            }
        });
    });
});

module.exports = AnnotateAPI;