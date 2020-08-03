const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../User/user-controller');
const config = require('../Config/database');

module.exports = function(passport) {
  let opts = {};
  //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt'); 
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('jwt payload is: ',jwt_payload);
    User.getUser(jwt_payload.data.email, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}
