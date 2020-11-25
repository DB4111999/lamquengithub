var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const uploaduser = require("../controllers/module/multer3");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    })
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  passport.use('local-signin', new LocalStrategy({
    usernameField: 'username',
    passReqToCallback: true
},
function (req, username, password, done) {
    User.findOne({'username': username}, function (err, username) {
      if(err) throw err;
      if(username){
        bcrypt.compare(password, username.password, function(err, user) {
            if(err) throw err;
            if(user){
                 return done(null, username);
            }else{
               return done(null, false,  req.flash('message','Sai Mật Khẩu'));
            }
        });
      }else{
         return done(null, false,   req.flash('message','Sai tên Đăng Nhập'));
      }
  });

})
)
  passport.use(
    'local-signup',
    new LocalStrategy({ passReqToCallback: true }, function(req, username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false,   req.flash('message','Tên đăng nhập đã tồn tại'));
        }

        if (password.length <= 6) {
          return done(null, false,   req.flash('message','Mật Khẩu phải trên 6 kí tự'));
        }

        if (password !== req.body.password2) {
          return done(null, false,   req.flash('message','Mật khẩu nhập lại không khớp'));
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) {
          return done(null, false,  req.flash('message','Địa chỉ email không hợp lệ'));
        }
        if (username.length <= 5) {
          return done(null, false,   req.flash('message','Tên đăng nhập phải trên 5 kí tự'));
        }
        User.findOne({ email: req.body.email }, (err, user) => {
         if (user) {
            return done(null, false,  req.flash('message','Địa Chỉ email này đã tồn tại'));
          }else{
        
            bcrypt.hash(password, 12).then(hashPassword => {
              const newUser = new User({
                username: username,
                password: hashPassword,
                email: req.body.email,
                phoneNumber:req.body.phoneNumber,
                address:req.body.address,
                fullname:req.body.fullname,
            
               
              });
              newUser.PhanQuyen = ['323232323232323232323232'];
              newUser.images = req.file.filename

              newUser.save(function(err) {
                if (err) return done(err);
                return done(null, newUser);
              });
            });
          }
        });
      })
  })
  )
  passport.use('admin-register',
    new LocalStrategy({ passReqToCallback: true }, function(req, username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false,   req.flash('message','Tên đăng nhập đã tồn tại'));
        }

        if (password.length <= 6) {
          return done(null, false,   req.flash('message','Mật Khẩu phải trên 6 kí tự'));
        }

        if (password !== req.body.password2) {
          return done(null, false,   req.flash('message','Mật khẩu nhập lại không khớp'));
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) {
          return done(null, false,  req.flash('message','Địa chỉ email không hợp lệ'));
        }
        if (username.length <= 5) {
          return done(null, false,   req.flash('message','Tên đăng nhập phải trên 5 kí tự'));
        }
        User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            return done(null, false,  req.flash('message','Địa Chỉ email này đã tồn tại'));
          }else{
            bcrypt.hash(password, 12).then(hashPassword => {
              const newUser = new User({
                username: username,
                password: hashPassword,
                email: req.body.email,
                phoneNumber:req.body.phoneNumber,
                address:req.body.address,
                fullname:req.body.fullname,
                PhanQuyen:req.body.PhanQuyen,
               
              });
              newUser.images = req.file.filename,
              newUser.isAuthenticated = true
              newUser.save(function(err) {
                if (err) return done(err);
                return done(null, newUser,req.flash("success_msg","Thêm Thành Công"));
              });
            });
          }
        });
 
      });
    })
    );
    passport.use('facebook',new FacebookStrategy({
      clientID: "911010132657834",
      clientSecret: "24d98ab4e78ead3b5778ed288e4937a0",
      callbackURL: "http://localhost:7000/auth/facebook/callback",
      profileFields: ['id','displayName','email','first_name','last_name','middle_name']
  },
  function (token, refreshToken, profile, done) {
      process.nextTick(function () {
          User.findOne({'facebook.id': profile.id}, function (err, user) {
              if (err)
                  return done(err);
              if (user) {
                  return done(null, user); 
              } else {                  var newUser = new User();
                  newUser.facebook.id = profile.id;
                  newUser.facebook.token = token;
                  newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                  newUser.facebook.email = profile.emails[0].value; 
                  newUser.isAuthenticated = true;
                  newUser.PhanQuyen = ['323232323232323232323232'];
                  newUser.save(function (err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
      });
  }));

  passport.use('google',new GoogleStrategy({
    clientID: "83576195064-k6dvkhbsp6lavlfi5b2ri2r61hd3c7rk.apps.googleusercontent.com",
    clientSecret: "TtVy4ttF82Z2enKVsbCZKg5P",
    callbackURL: "http://localhost:7000/auth/google/callback",
    profileFields: ['id','displayName','email']
},
function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
        User.findOne({'google.id': profile.id}, function(err, user){
            if(err)
                return done(err);
            if(user)
                return done(null, user);
            else {
                var newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.google.email = profile.emails[0].value;
                newUser.isAuthenticated = true;
                newUser.PhanQuyen = ['323232323232323232323232'];

                newUser.save(function(err){
                    if(err)
                        throw err;
                    return done(null, newUser);
                })
                console.log(profile);
            }
        });
    });
}));
      
}
