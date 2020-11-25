const cate = require("../models/productType");
const pro = require("../models/products");
const Cart = require("../models/cart");
const User = require("../models/user");
exports.getindex =  function (req, res,next){
  pro.find()
  .then(product => {
    pro.find()
    .limit(8)
    .sort("buyCounts")
    .then(products2 => {
      pro.find()
      .limit(8)
      .sort("viewCounts")
      .then(products3 => {
    cate.find()
      .then(cates => {
        res.render("front-end/index", {
          product:product ,
          title: "Trang Chủ",
          cates: cates,
          hots: products2,
          view: products3,
          user: req.user
        });
      });
    });
  });
  })
  .catch(err => {
    console.log(err);
  });
}

exports.gettechnology =  function (req, res,next){
  pro.find()
  .then(product => {
    cate.find()
      .then(cates => {
        res.render("front-end/technology", {
          product:product ,
          title: "Công Nghệ",
          cates: cates,
          user: req.user
        });
      });
  })
  .catch(err => {
    console.log(err);
  });
}
exports.getintroduce =  function (req, res,next){
  pro.find()
  .then(product => {
    cate.find()
      .then(cates => {
        res.render("front-end/introduce", {
          product:product ,
          title: "Giới Thiệu",
          cates: cates,
          user: req.user
        });
      });
  })
  .catch(err => {
    console.log(err);
  });
}
exports.getphukien =  function (req, res,next){
  pro.find()
  .then(product => {
    cate.find()
      .then(cates => {
        res.render("front-end/accessories", {
          product:product ,
          title: "Phụ Kiện",
          cates: cates,
          user: req.user
        });
      });
  })
  .catch(err => {
    console.log(err);
  });
}
exports.getproducts =  function (req, res,next){
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  pprice = req.query.price !== undefined ? req.query.price : 999999999;
  plowerprice = pprice !== 999999999 ? pprice - 4999999 : 0;
  plowerprice = pprice == 100000000 ? 19999999 : plowerprice;
  var page = +req.query.page || 1;
  var ITEM_PER_PAGE= 8;
  let totalItems;
  pro.find({
    price: { $gt: plowerprice, $lt: pprice }
  })
    .countDocuments()
    .then(numProduct => {
      totalItems = numProduct;
      return pro.find({
        price: { $gt: plowerprice, $lt: pprice }
      })
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    .then(product => {
    cate.find()
      .then(cates => {
        res.render("front-end/product", {
          product:product ,
          cates: cates,
          user: req.user,
          title: "Sản Phẩm",
          currentPage: page,
          hasNextPage: ITEM_PER_PAGE * page < totalItems ,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems  / ITEM_PER_PAGE),
          ITEM_PER_PAGE: ITEM_PER_PAGE,
        });
      })
    })

  .catch(err => {
    console.log(err);
  });
}
exports.postNumItems = (req, res, next) => {
  ITEM_PER_PAGE = parseInt(req.body.numItems);
  res.redirect("back");
};
exports.getproductdetails =  function (req, res,next){
  pro.findByIdAndUpdate(req.params.id,{$inc: {viewCounts: 1}})
  .populate('NhaCungCap')
  .then(product => {
    pro.find({ "productType.id": product.productType.main })
    .limit(3)
    .then(
      other => {
        pro.find({ "productType.main": product.productType.main })
        .limit(4)
        .then(
          relatedProducts => {
    cate.find()
      .then(cates => {
        res.render("front-end/productdetails", {
          product:product ,
          cates: cates,
          viewCounts: product.viewCounts,
          user: req.user,
          other:other,
          title: `${product.name}`,
          relatedProducts:relatedProducts,
          comments: product.comment.items,
          allComment: product.comment.total,
        });
      });
  })
})
})
  .catch(err => {
    console.log(err);
  });
}
exports.getproductType =  function (req, res,next){
  pprice = req.query.price !== undefined ? req.query.price : 999999999;
  plowerprice = pprice !== 999999999 ? pprice - 4999999 : 0;
  plowerprice = pprice == 100000000 ? 19999999 : plowerprice;
  var page = +req.query.page || 1;
  var ITEM_PER_PAGE= 8;
  let totalItems;
  pro.find({productType:req.params.id,  price: { $gt: plowerprice, $lt: pprice }
  })
    .countDocuments()
    .then(numProduct => {
      totalItems = numProduct;
      return pro.find({productType:req.params.id,  price: { $gt: plowerprice, $lt: pprice }
      })
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    .then(product=>{
    cate.find()
      .then(cates => {
        res.render("front-end/productType", {
          product:product ,
          cates: cates,
          user: req.user,
          title: `${cates.name}`,
          currentPage: page,
          hasNextPage: ITEM_PER_PAGE * page < totalItems ,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems  / ITEM_PER_PAGE),
          ITEM_PER_PAGE: ITEM_PER_PAGE,
      });
  })
})
  .catch(err => {
    console.log(err);
  });
}
exports.postComment = (req, res, next) => {
  var tname;
  if (typeof req.user === "undefined") {
    tname = req.body.inputName;
  } else {
    tname = req.user.username;
  }
  pro.findOneAndUpdate({_id:req.params.id },
     {   $push:{
    "comment.items":{
      title: req.body.inputTitle,
      content: req.body.inputContent,
      name: tname,
      date: new Date(),
      star: req.body.star
    }
    }
    }
    ).then(product => {
      product.comment.total++;
      product.save();
    });
  res.redirect("back");
};

exports.getCart = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  cate.find()
  .then(cates => {
  res.render("front-end/cart", {
    title: "Giỏ hàng",
    user: req.user,
    cates:cates, 
    cartProduct: cartProduct
  });
})
};

exports.addToCart = (req, res, next) => {
  var id = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  pro.findById(id, (err, product) => {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, id);
    req.session.cart = cart;
    if(req.isAuthenticated()){ 
      User.findOne({username:req.user.username}).then((user)=> {
          user.cart= cart;  
          user.save();
          console.log(user.cart);
      })
  }
  console.log(req.session.cart);   
  res.redirect('back');    
  });
};

exports.addcart = (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.addByOne(productId);
  req.session.cart = cart;
  
  res.redirect('back');
};
exports.reducecard = (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('back');
};
exports.getDeleteCart = (req, res, next) => {
  req.session.cart = null; 
  User.findOne({username:req.user.username}).then((user)=> {
          user.cart = {};
          user.save();
          console.log(user.cart);
      })

  res.redirect("back");
};

exports.getDeleteItem = (req, res, next) => {
  var id = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  pro.findById(id, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.deleteItem(id);
    req.session.cart = cart;
    if(req.isAuthenticated()){ 
      User.findOne({username:req.user.username}).then((user)=> {
          user.save();
      })
  }
    console.log(req.session.cart);
    res.redirect("back");
  });
};
exports.mergeCart = (req, res, next) => {
  if (req.user.cart != {} && req.user.cart) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart = cart.addCart(req.user.cart);
    req.session.cart = cart;
    req.user.cart = cart;
    if(req.isAuthenticated()){ 
      User.findOne({username:req.user.username}).then((user)=> {
          user.save();
      })
  }
  }
  res.redirect("/");
};

exports.getSearch = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  searchText =
  req.query.searchText !== undefined ? req.query.searchText : searchText;
  const page = +req.query.page || 1;
    cate.find()
    .then(cates => {
  pro.find({
    $text: { $search: searchText }
  })
  .countDocuments()
  .then(numProduct => {
    totalItems = numProduct;
    return pro.find({
      $text: { $search: searchText }
    })
      .skip((page - 1) * 12)
      .limit(12);
  })
    .then(products => {
      res.render("front-end/search", {
        title: "Kết quả tìm kiếm cho " + searchText,
        user: req.user,
        searchProducts: products,
        searchT: searchText,
        currentPage: page,
        hasNextPage: 12 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / 12),
       
        cartProduct: cartProduct,
        cates:cates, 
      });
    })
  })
    .catch(err => {
      console.log(err);
    });
};


    