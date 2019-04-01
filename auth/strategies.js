'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');


// allowed the user to supply a username and password to authenticate with an endpoint;
const localStrategy = new LocalStrategy((username, password, callback) => {
  // we make a global variable within this app taht we can reference throughout the thenables
  let user;
  User.findOne({ username: username })
    .then(_user => {
      console.log("user ", _user);
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // returns a boolean value indicating whether or not the password is valid
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // this is where we need to return user after the password has been verified as valid
      // the user object will be added to the request object at req.user
      return callback(null, user);
    })
    .catch(err => {
      console.log("error aqui ", err);
      if (err.reason === 'LoginError') {
        console.log("error here ", err);
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

// new JwtStrategy(options, verify)
// http://www.passportjs.org/packages/passport-jwt/

// verify is a function with the parameters verify(jwt_payload, done)
// jwt_payload is an object literal containing the decoded JWT payload.
// done is a passport error first callback accepting arguments done(error, user, info)

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  // payload is an object literal containing the decoded JWT payload.
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
