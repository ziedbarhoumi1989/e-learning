const Express = require('express');
const Class = require('./class-controller');
const User = require('../User/user-model');
const UserController = require('../User/user-controller');

let ClassAPI= Express.Router();

ClassAPI.post('/class/create', (req, res) => {

            Class.createClass(req.body.title, req.body.module_code, req.body.teacher, (error, module) => {
                if(error) {
                  res.json({status: false, error: error});
                }
                else res.json(
                  {
                    status: true, 
                    message: 'Class / Module Created', 
                    module: module
                    });
            });
        // }
    });

// Todo: Re-implement this.

// ClassAPI.get('/class/:module_code', (req, res) => {
//     Class.get(req.params.module_code, (error, module) => {
//
//         if (error || !module)
//             res.status(401).json(
//                 {status: false, error: "Class / Module + " + req.params.module_code + " not found / Permission Denied"});
//
//         else {
//             User.findById(module.teacher[0], 'email university role -_id', (error, teacher) => {
//                 res.status(200).json({status: true, title: module.title, module_code: module.module_code,
//                     teacher: teacher, archived: module.archived});
//             });
//         }
//     });
// });
//
 ClassAPI.put('/class/:module_code', (req, res) => {

    Class.updateClass(req.body, (error, module) => {
        if(error || !module) res.json({status: false, error: "Class / Module " + req.body.module_code + " not found / Permission Denied"});
        else {
           res.json({status: true, message: "Class / Module " + module.module_code + " has been updated.", module: module});
        }
    });
 });

ClassAPI.post('/class/enroll/:module_code', (req, res) => {

    UserController.enroll(req.params.module_code, req.body, (error, student) => {
       if(error || !student) res.json({status: false, error: error});

       else { res.json({status: true, message: student.email + " enrolled successfully in " + req.params.module_code}) }
    });
});


//
// ClassAPI.get('/class/students/:module_code', (req, res) => {

//     Class.getEnrolledStudents(req.params.module_code, (error, students) => {

//         if(error || !students) res.json({status: false, error: "Could not find Module Code / Students"});
//         else {
//             res.json({status: true, students: students});
//         }

//     });
// });
//
// ClassAPI.get('/class/classes/:teacher_id', (req, res) => {

//   Class.getClassByTeacher(req.params.teacher_id, (error, classes) => {
//     if(error || !classes) res.json({status: false, error: "Could not find teacher with that id"});
//     else{
//       res.json({status: true, classes: classes});
//     }
//   });
// });

ClassAPI.get("/class/module=:module_code", (req, res) => {

    Class.getClass(req.params.module_code, (error, module) => {

        if (error)
            res.json({status: false, error: error});
        else
            res.json(module);

    });

});
// ClassAPI.get("/class/id=:_id", (req, res) => {

//     Class.getClassById(req.params._id, (error, module) => {

//         if (error){
//             res.json({status: false, error: error});
//           }
//         else
//             res.json(module);

//     });

// });

ClassAPI.get("/classes", (req, res) => {

    Class.getClasses((error, classes) => {

       if (error)
           res.json({status: false, error: error});

       else
           res.json({classes});

    });

});


ClassAPI.get("/classes/students/:module_code", (req, res) => {

    Class.getEnrolledStudents(req.params.module_code, (error, students) => {

        if (error)
            res.json({status: false, error: error});

        else
            res.json(students);

    });

});


module.exports = ClassAPI;
