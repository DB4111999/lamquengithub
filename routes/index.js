var express = require('express')
, auth = require('./auth')
, admin = require('./admin')
, router = express.Router()
  , productcontroller = require('../controllers/products')
router.get('/',productcontroller.getindex
);
router.get('/technology',productcontroller.gettechnology
);

router.get('/introduce',productcontroller.getintroduce
);
router.get('/accessories',productcontroller.getphukien
);
router.get('/showproduct',productcontroller.getproducts
);
router.post("/showproduct", productcontroller.postComment);
router.get('/getproductdetails/:id',productcontroller.getproductdetails
);
router.get('/getproductType/:id',productcontroller.getproductType
);
router.post("/getproductdetails/:id", productcontroller.postComment);
router.get("/cart", productcontroller.getCart);

router.get("/add-to-cart/:id", productcontroller.addToCart);

router.get('/add/:id', productcontroller.addcart);
router.get('/reduce/:id', productcontroller.reducecard);

router.get("/delete-cart", productcontroller.getDeleteCart);

router.get("/delete-item/:id", productcontroller.getDeleteItem);

router.get("/merge-cart", productcontroller.mergeCart);
router.get("/search", productcontroller.getSearch);
router.use('/', auth);
router.use('/admin', admin);
module.exports = router;