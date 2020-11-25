
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
    Order.find({ user: req.user }).then(order => {
      res.render("account", {
        title: "Thông tin tài khoản",
        user: req.user,
        cartProduct: cartProduct,
        order: order,
        messageSucc: messageSucc,
        messageError:messageError
      });
    });
  };
  
  exports.getAccountChange = (req, res, next) => {
    var cartProduct;
    if (!req.session.cart) {
      cartProduct = null;
    } else {
      var cart = new Cart(req.session.cart);
      cartProduct = cart.generateArray();
    }
    res.render("account-change-info", {
      title: "Thay đổi thông tin tài khoản",
      user: req.user,
      cartProduct: cartProduct
    });
  };
  
  exports.postAccountChange = (req, res, next) => {
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.email = req.body.email;
    req.user.address = req.body.address;
    req.user.phoneNumber = req.body.phoneNumber;
    req.user.save();
    res.redirect("/account");
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
    res.render("change-password", {
      title: "Đổi mật khẩu",
      message: `${message}`,
      user: req.user,
      cartProduct: cartProduct
    });
  };
  
  exports.postChangePassword = (req, res, next) => {
    bcrypt.compare(req.body.oldpass, req.user.password, function(err, result) {
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
          req.user.password = hashPassword;
          req.user.save();
        });
        req.flash("success", "Đổi mật khẩu thành công!");
        res.redirect("/account");
      }
    });
  };  