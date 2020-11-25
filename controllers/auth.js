const passport = require("passport");
const Users = require("../models/user");
const pro = require("../models/products");
const Order = require("../models/order");
const Cart = require("../models/cart");

const LienHe = require("../models/lienhe");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cate = require("../models/productType");
var randomstring = require("randomstring");
const uploaduser = require("../controllers/module/multer3");
const cart = require("../models/cart");
const order = require("../models/order");


exports.getLogin = (req, res, next) => {
  cate.find()
  .then(cates => {
  if (!req.isAuthenticated()) {
    res.render("front-end/login", {
      title: "Đăng nhập",
      message: req.flash('message'), 
      cates:cates, 
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
})
};
exports.postLogin = (req, res, next) => {
    passport.authenticate("local-signin", {
      successReturnToOrRedirect: "/merge-cart",
      failureRedirect: "/login",
      failureFlash: true
    })(req, res, next);
  }
  exports.getSignUp = (req, res, next) => {
    cate.find()
    .then(cates => {
    if (!req.isAuthenticated()) {
      res.render("front-end/register", {
        title: "Đăng ký",
        message: req.flash('message'), 
        cates:cates, 
        user: req.user,
      });
    } else {
      res.redirect("/");
    }
  })
  };
  exports.postSignUp = (req, res, next) => {
    uploaduser(req, res, function (err) {
      if(req.file == null || req.file == undefined || req.file == ""){ 
          req.flash('message','File bạn tải lên không hợp lệ');
          res.redirect('/register');
               
      }else{
    passport.authenticate("local-signup", {
      successReturnToOrRedirect: "/verify-email",
      failureRedirect: "/register",
      failureFlash: true
    })(req, res, next);
  }})
  };
  exports.getLogout = (req, res, next) => {
    if (req.session.cart) {
      req.session.cart = null;
    }
    req.logout();
    res.redirect("/");
  };
  exports.getVerifyEmail = (req, res, next) => {
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "db4111999@gmail.com",
        pass: "Dinhbao11"
      }
    });
    Users.findOne({ username: req.user.username }).then(user => {
      var verification_token = randomstring.generate({
        length: 10
      });
      var mainOptions = {
        from: "Crepp so gud",
        to: req.user.email,
        subject: "Mã xác thực",
        text: "text ne",
        html:
          "<p>Cảm ơn đã đăng kí tài khoản của HD STORE Mã kích hoạt của bạn là:</p>" +
          verification_token
      };
      transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Sent:" + info.response);
        }
      });
      user.verify_token = verification_token;
      user.save();
    });
    cate.find()
    .then(cates => {
    res.render("front-end/verify-email", {
      title: "Xác thực email",
      message: req.flash("error"),
      cates:cates, 
      user: req.user,
    });
  })
  };
  
  exports.postVerifyEmail = (req, res, next) => {
    const token = req.body.token;
    Users.findOne({ username: req.user.username }, (err, user) => {
      if (token == user.verify_token) {
        user.isAuthenticated = true;
        user.save();
        return res.redirect("/login");
      } else if (token != user.verify_token) {
        req.flash("error", "Mã xác thực không hợp lệ");
        return res.redirect("/verify-email");
      }
    });
  };
  exports.getForgotPass = (req, res, next) => {
    cate.find()
    .then(cates => {
    res.render("front-end/forgotpassword", {
      title: "Quên mật khẩu",
      message:req.flash("error"),
      success_msg:req.flash("success_msg"),
      cates:cates, 
      user: req.user,
    });
  })
  };
  exports.postForgotPass = (req, res, next) => {
    const email = req.body.email;
    Users.findOne({ email: email }, (err, user) => {
      if (!user) {
        req.flash("error", "Không có tài khoản nào có email này");
        return res.redirect("/forgotpassword");
      } else {
        var transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "db4111999@gmail.com",
            pass: "Dinhbao11"
          }
        });
        var tpass = randomstring.generate({
          length:9
        });
        var mainOptions = {
          from: "Crepp so gud",
          to: email,
          subject: "Mật Khẩu của bạn",
          text: "text ne",
          html: "<p>Mật khẩu mới của bạn là:</p>" + tpass
        };
        transporter.sendMail(mainOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Sent:" + info.response);
          }
        });
        bcrypt.hash(tpass, 12).then(hashPassword => {
          user.password = hashPassword;
          user.save();
        });
        req.flash("success_msg","vui lòng nhận mật khẩu mới tại email của bạn")
        res.redirect("/forgotpassword");
      }
    });
  };
  exports.getcontact =  function (req, res,next){
      cate.find()
        .then(cates => {
          res.render("front-end/contact", {
            title: "Liên Hệ",
            cates: cates,
            user: req.user
          });
    })
    .catch(err => {
      console.log(err);
    });
  }
  
exports.getAccount = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  cate.find()
  .then(cates => {
  Order.find({ user: req.user }).then(order => {
    res.render("front-end/account", {
      title: "Thông tin tài khoản",
      user: req.user,
      cartProduct: cartProduct,
      order: order,
      cates:cates,
      messageSucc: messageSucc,
      messageError:messageError
    });
  })
})
};
  exports.postcontact = (req, res, next) => {
    var lienhe = new LienHe()
    lienhe.email = req.body.email,
    lienhe.HoTen = req.body.HoTen;
    lienhe.BinhLuan = req.body.BinhLuan;
    lienhe.TieuDe = req.body.TieuDe;
    
    lienhe.save(function (err) {
      if(err)
        console.log(err);
      else
        req.flash('success_msg', 'Đã Liên Hệ Thành Công');
        res.redirect('/contact');
    });
    }
    exports.getaddOrder = (req, res, next) => {
      var cartProduct;
      if (!req.session.cart) {
        cartProduct = null;
      } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
      }
      cate.find()
      .then(cates => {
      res.render("front-end/checkout", {
        title: "Thông tin giao hàng",
        user: req.user,
        cates:cates,
        cartProduct: cartProduct
      });
    })
  }
    

    exports.postAddOrder = async (req, res, next) => {
      var cartProduct;
      if (!req.session.cart) {
        cartProduct = null;
      } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
      }
       
      console.log(req.session.cart);
      if (req.session.cart.totalQty) {
        var order = new Order({
          user: req.user,
          cart: req.session.cart,
          address: req.body.address,
          nguoinhan:req.body.nguoinhan,
          loinhan:req.body.loinhan,
          phoneNumber: req.body.phone,
          email:req.body.email,
          danhsachsanpham :  cartProduct,
          trangthai :0
        });
        for (var id in req.session.cart.items) {
          await pro.findOne({ _id: id })
            .then(product => {
              product.buyCounts += parseInt(req.session.cart.items[id].qty);
              product.stock -= parseInt(req.session.cart.items[id].qty);
              product.save();
            })
            .catch(err => console.log(err));
        }
    
        order.save((err, result) => {
          req.flash("success", "Đặt hàng thành công!");
          req.session.cart = null;
          req.user.cart = {};
          if(req.isAuthenticated()){ 
            Users.findOne({username:req.user.username}).then((user)=> {
                user.save();
            }) 
        }
          res.redirect("/account");
        });
      } else {
        req.flash("error", "Giỏ hàng rỗng!");
        res.redirect("/account");
      }
    };
    exports.getChangePassword = (req, res, next) => {
      const message = req.flash("error")[0];
      var cartProduct;
      if (!req.session.cart) {
        cartProduct = null;
      } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
      }
      cate.find()
      .then(cates =>{
      res.render("front-end/change-password", {
        title: "Đổi mật khẩu",
        message: `${message}`,
        user: req.user,
        cates:cates,
        cartProduct: cartProduct
      })
      });
    };

    exports.postChangePassword = (req, res, next) => {
        Users.findOne({username:req.user.username}).then((user)=> {
      bcrypt.compare(req.body.oldpass, user.password, function(err, result) {
        console.log("alo?");
        if (!result) {
          req.flash("error", "Mật khẩu cũ không đúng!");
          return res.redirect("back");
        } else if (req.body.newpass != req.body.newpass2) {
          console.log(req.body.newpass);
          console.log(req.body.newpass2);
          req.flash("error", "Nhập lại mật khẩu không khớp!");
          return res.redirect("back");
        } else {
          bcrypt.hash(req.body.newpass, 12).then(hashPassword => {
            user.password = hashPassword;
            user.save();
          });
          req.flash("success", "Đổi mật khẩu thành công!");
          res.redirect("/account");
        }
      });
    })
    };  
    exports.deletegiohang =  async(req, res,next)=>{
      Order.findById(req.params.id).remove(function() {

        req.flash('success', 'Đã Xoá Thành Công');
        res.redirect('/account');
      });
    }
    exports.getAccountChange = (req, res, next) => {
      var cartProduct;
      if (!req.session.cart) {
        cartProduct = null;
      } else {
        var cart = new Cart(req.session.cart);
        cartProduct = cart.generateArray();
      }
      cate.find()
      .then(cates=>{
      res.render("front-end/AccountChange", {
        title: "Thay đổi thông tin tài khoản",
        user: req.user,
        cartProduct: cartProduct,
        cates:cates
      });
    })
    };
    exports.posAccountChange = (req, res, next) => {
      Users.findOne({username:req.user.username}).then((user)=> {
      uploaduser(req, res, function (err) {
        if(req.file == null || req.file == undefined || req.file == ""){ 
     
            req.flash('message','File bạn tải lên không hợp lệ');
            res.redirect('back');   
        }else{
              user.images = req.file.filename,
              user.fullname = req.body.fullname,
              user.email = req.body.email,
              user.address = req.body.address,
              user.phoneNumber = req.body.phoneNumber,
              
          user.save(function (err) {
            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash("success", "Thay đổi thông tin thành công!");
            res.redirect("/account");
          });
          }
        })
      })
    
}