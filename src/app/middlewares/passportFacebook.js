const passport = require("passport");
const passportFacebook = require("passport-facebook");

require('dotenv').config({ path: 'src/config.env' });
const User = require('../model/User');


let FacebookStrategy = passportFacebook.Strategy;

let initPassportFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: 'https://webbanhangcmobie.up.railway.app/user/auth/facebook/cb',
        profileFields: ['email','gender','displayName']
    },(accessToken,refreshToken,profile,done) => {
        
        User.findOne({email: profile._json.email},(error,user) => {
            if(error) return done(error);
            if(!user.status) return done(null,false);
            if(!user.isFacebook) return done(null,false);
            if(user) return done(null,user);
            
            const newUser = new User({
                isFacebook: true,
                fullname: profile._json.name,
                email: profile._json.email,
                gender: profile._json.gender
            })
            newUser.save((err) => {
                if(err) return done(err);
                return done(null,newUser);
            });
        })
    }));
  };


  passport.serializeUser(function(user, done) {
    done(null,user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findOne({id},(err,user) => {
        return done(null,user);
    })
  });
  
  module.exports = initPassportFacebook;
