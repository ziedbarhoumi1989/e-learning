const User = require('../User/user-controller');
const FakeGenerator = require('./test-utils');

let FakeTeacher = FakeGenerator.generateFakeUser();
let FakeStudent = FakeGenerator.generateFakeUser();
let DevToken = "testtoken-dev";

let DevUser = {

    name: {
        first: "Developer",
        last: "TestAccount"
    },

    email: "developer@classroom.com",
    password: "password",
    university: "Root"
};

let UpdatedUser = {

    name: {
        first: "Dev",
        last: "Account"
    },

    role: "Teacher"
};


// TODO: Actual Handle the Callbacks.

//User.createStudent(DevUser.name, DevUser.email, DevUser.password, DevUser.university);//creates fake student
//User.createTeacher(DevUser.name, DevUser.email, DevUser.password, DevUser.university, DevToken);

//User.createTeacher(FakeTeacher.name, FakeTeacher.email, FakeTeacher.password, FakeTeacher.university, DevToken);
// User.createStudent(FakeStudent.name, FakeStudent.email, FakeStudent.password, FakeStudent.university);

User.getUser(DevUser.email, function () {});

// User.updateUser(DevUser.email, UpdatedUser);

// User.enroll("CR000", DevUser, function () {});


// User.joinGroup("5ad8dc117220d6b852e17e9e", DevUser, function () {});
