var express = require('express')
  , router = express.Router()
  , admincontrollers = require('../controllers/admin')
  , passport = require("passport")
  router.get("/all",isadmin,admincontrollers.admin),
  
 router.get('/getcateall',isadmin,admincontrollers.getcateall),
 router.get('/getcateadd',isadmin,admincontrollers.getcateadd),
 router.get('/getcateupdate/:id',admincontrollers.getcateupdate)
 router.post('/getcateadd',admincontrollers.postcateadd),
 router.post('/getcateupdate/:id',admincontrollers.postcateupdate),
 router.get('/deletecate/:id',isadmin,admincontrollers.deletecate),
 router.get('/getproductall',isadmin,admincontrollers.getproductall),
 router.get('/getproductadd',isadmin,admincontrollers.getproductadd),
 router.post('/getproductadd',isadmin,admincontrollers.postproductadd),
 router.get('/deleteproduct/:id',isadmin,admincontrollers.deleteproduct),
 router.get('/getproductupdate/:id',admincontrollers.getproductupdate),
 router.post('/getproductupdate/:id',admincontrollers.postproductupdate),
 router.get('/getuserall',isadmin,admincontrollers.getuserall),
 router.get('/getuseradd',isadmin,admincontrollers.getuseradd),
 router.post('/getuseradd',isadmin,admincontrollers.postuseradd),
 router.get('/getuserupdate/:id',isadmin,admincontrollers.getuserupdate),
 router.post('/getuserupdate/:id',admincontrollers.postuserupdate),
 router.get('/deleteuser/:id',admincontrollers.deleteuser),
 router.get('/getnccadd',isadmin,admincontrollers.getnccadd),
 router.get('/getnccall',isadmin,admincontrollers.getnccall),
 router.post('/getnccadd',isadmin,admincontrollers.postnccadd);
 router.get('/getupdatencc/:id',isadmin,admincontrollers.getnccupdate),
 router.post('/getupdatencc/:id',admincontrollers.postnccupdate);
 router.get('/deletencc/:id',admincontrollers.deletencc);
 router.get('/getcartall',isadmin,admincontrollers.getdonhang);
 router.get('/xemdonhang/:id',isadmin,admincontrollers.xemdonhang);
 router.get('/addthanhtoan/:id',isadmin,admincontrollers.addthanhtoan);
 function isadmin(req, res, next) {
  if(req.isAuthenticated() && req.user.PhanQuyen === '313131313131313131313131' ){
    return next();
  } else
  res.redirect('/login');
};

  module.exports = router;