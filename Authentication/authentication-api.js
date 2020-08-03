const Express = require('express');
const User = require('../User/user-controller');
//const JWT = require('../JWT/jwt-controller');
const config = require('../Config/database');
const jwt = require('jsonwebtoken');
const AuthUtils = require('../Authentication/authentication-utils');
const passport = require('passport');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

let AuthAPI = Express.Router();

AuthAPI.post('/auth/register', (req, res) => {

    User.getUser(req.body.email, (error, user) => {

        if (user) {
            res.json({error: "User already exists"});
        }

        else {
            // Todo: Add checks for Body parameters - Ask Adam.
            User.createTeacher(req.body.name, req.body.email, req.body.password, req.body.university, req.body.token,(error, user) => {
                if(error) res.json({status: false, error: error});
                else res.json(user);
            });
        }
    })

});

// AuthAPI.post('/authenticate', (req, res) => {

//     User.getUser(req.body.email, (error, user) => {

//         if(user && AuthUtils.validatePassword(req.body.password, user.password)){
//             res.json({status: true, message: 'User Authenticated', user: JWT.generateAuthJson(user), name:{first: user.first, last: user.last}});
//         }

//         else res.json({status: false, error: "Failed to Authenticate"});
//     });
// });

AuthAPI.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;


  User.getUser(email, (err, user) => {
    //if(err){ throw err;}
    if (err || user === null){
            res.json({status: false, error: err});
    }
    else{
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err){ throw err;}

      else if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: "JWT " +token,
          user: {
            id: user._id,
            name: {
                first: user.first,
                last: user.last
            },
            email: user.email,
            role: user.role
          }
        })

      } 
      else {

          return res.json({success: false, msg: 'Wrong password'});
      }
    })
    };
  });
});

AuthAPI.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});



module.exports = AuthAPI;