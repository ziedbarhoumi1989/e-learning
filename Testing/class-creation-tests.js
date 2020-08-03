const Class = require('../Classes/class-controller');
const FakeGenerator = require('./test-utils');

let DevTeacher = {

    name: {
        first: "Developer",
        last: "TestAccount"
    },

    email: "developer@classroom.com",
    password: "password",
    university: "Root"
};

let DevClass = {

    title: "Introduction to Classroom",
    module_code: "CR000",
    teacher: DevTeacher
};

let UpdatedDevClass = {

    title: "Introduction to Classroom 2.0",
};

//Class.createClass(DevClass.title, DevClass.module_code, DevClass.teacher);

// Class.getClass("CR000", function () {});

// Class.updateClass("CR000", UpdatedDevClass, function () {});

// Class.archiveClass("CR000");

// Class.getEnrolledStudents("CR000", function () {});





