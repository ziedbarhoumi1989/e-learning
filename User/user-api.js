const Express = require('express');
const User = require('../User/user-controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');



let UserAPI = Express.Router();

UserAPI.get("/user/:email", (req, res) => {

    User.getUser(req.params.email, (error, user) => {

        if (error || user === null)
            res.json({status: false, error: error});

        else
            res.json(user);

    });
});



UserAPI.put('/user/update/:email', (req, res) => {

    User.updateUser(req.params.email, req.body, (error, user) => {

        res.json(user);
        console.log(user);

        if(error){
            console.log(error);
        }

    });

});

UserAPI.post('/users/createStud', (req, res) => {

    let data = req.body;

    User.createStudent(data.first, data.last, data.email, data.password, data.university, (error, student) => {

        res.json(student);

    });

});
UserAPI.post('/users/createTeacher', (req, res) => {

    let data = req.body;

    User.createTeacher(data.first, data.last, data.email, data.password, data.university, (error, teacher) => {

        res.json(teacher);

    });

});

UserAPI.get('/users/students', (req, res) => {

    User.getStudents((error, students) => {

        if (error || students == null)
            res.json({status: false, error: error});

        else
            res.json(students);
    });

});


UserAPI.get('/users/teachers', (req, res) => {

    User.getTeachers((error, teachers) => {

        if (error || teachers == null)
            res.json({status: false, error: error});

        else
            res.json(teachers);
    });

});


UserAPI.get('/users/all', (req, res) => {


    User.getAll((error, users) => {

        if (error || users == null)
            res.json({status: false, error: error});

        else
            res.json(users);

    });

});

UserAPI.put('/user/update/submission/:email', (req, res)=>{

    //let body = req.body;

    User.updateSubmissions(req.params.email, req.body.submission, (error, success)=>{
        res.json(success);
    });
})

module.exports = UserAPI;