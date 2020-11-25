var express = require('express')
  , router = express.Router()
  , passport = require("passport")
  , authcontrollers = require('../controllers/auth')
router.get('/login',authcontrollers.getLogin)
router.get('/register',authcontrollers.getSignUp);
router.post('/register', authcontrollers.postSignUp);
router.post('/login', authcontrollers.postLogin);
router.get('/contact',authcontrollers.getcontact
);
router.post('/contact',authcontrollers.postcontact
);
router.get('/checkout',isLoggedIn,authcontrollers.getaddOrder
);
router.post('/checkout',authcontrollers.postAddOrder
);
router.get('/change-password',isLoggedIn,authcontrollers.getChangePassword
);
router.post('/change-password',authcontrollers.postChangePassword 
);
router.get('/deletegiohang/:id',authcontrollers.deletegiohang),
router.get('/account',isLoggedIn,authcontrollers.getAccount
);

router.get('/AccountChange',isLoggedIn,authcontrollers.getAccountChange
);
router.post('/AccountChange',authcontrollers.posAccountChange
);
router.get("/verify-email",isLoggedIn, authcontrollers.getVerifyEmail);
router.post("/verify-email",isLoggedIn, authcontrollers.postVerifyEmail);
router.get("/forgotpassword", authcontrollers.getForgotPass);
router.post("/forgotpassword", authcontrollers.postForgotPass);
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
router.get('/auth/facebook',
passport.authenticate('facebook',{scope:['email']}));

router.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
module.exports = router;