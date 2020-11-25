var express = require('express');
var app = express();
var port = process.env.PORT || 7000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var multer = require('multer');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());

var session = require('express-session');
var configDB = require('./config/database.js');
var path = require('path');
var expressValidator = require('express-validator');
app.use(expressValidator());  //this line to be addded
var MongoDBStore = require('connect-mongo')(session);
var fs = require('fs');
var dir = './uploads';
mongoose.connect(configDB.url); 
const Cart = require('./models/cart');
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser()); 
app.set('view engine', 'ejs'); 
const store = new MongoDBStore({
  host: '127.0.0.1',
  port: '27017',
  db: 'session',
  url: 'mongodb://localhost:27017/PhoneShop'
});
app.use(
  session({
    secret: 'notsecret',
    saveUninitialized: true,
    resave: false,
    store: store,
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session()); 
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
  app.use((req, res, next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.session = req.session;
    next();
  });
  app.use(function(err, req, res, next) {
    var cartProduct;
    if (!req.session.cart) {
      cartProduct = null;
    } else {
      var cart = new Cart(req.session.cart);
      cartProduct = cart.generateArray();
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('front-end/error', { cartProduct: cartProduct });
  });
  
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.listen(port);
var index = require('./routes/index');
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use('/', index);
var fileupload = require("express-fileupload");
app.use(fileupload());
require('./config/passport')(passport);
console.log(port);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"