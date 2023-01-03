const passport = require("passport");
const passportLocal = require("passport-local");

const bcrypt = require('bcrypt');
const User = require('../model/User');


let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use('local',new LocalStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    }, async (req, email, password, done)=> {
      try {
        
        let user = await User.findOne({email});
        if (!user) {
          
          return done(null, false,req.flash('message', 'Tài khoản hoặc mật khẩu không chính xác!' ));
        }
        if(!user.status){
          return done(null, false,req.flash('message', 'Tài khoản của bạn đã bị khóa, liên hệ admin để được giúp đỡ!' ));
        }
        if(user.isFacebook){
          return done(null, false,req.flash('message', 'Email này chỉ có thể đăng nhập bằng tài khoản Facebook' ));
        }
        let checkPassword = await bcrypt.compare(password,user.password);
  
        if (!checkPassword) {
          
          return done(null, false,req.flash('message', 'Tài khoản hoặc mật khẩu không chính xác!' ));
        }
  
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(null, false);
      }
    }));
  };


  passport.serializeUser(function(user, done) {
    
    done(null, user.id);

  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id,function(err, user) {
      done(err, user);
    }).lean()
  });
  
  module.exports = initPassportLocal;