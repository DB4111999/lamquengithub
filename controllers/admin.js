const cate = require("../models/productType");
const pro = require("../models/products");
const NCC = require("../models/NhaCungCap");
const banner = require("../models/banner");
const lienhe = require("../models/lienhe");
const slider = require("../models/slider");
var bcrypt = require('bcryptjs');
const upload = require("./module/multer");
const uploads = require("./module/multer2");
const uploaduser = require("./module/multer3");
const uploadbanner = require("./module/multer4");
const uploadslider = require("./module/multer5");
const Users = require("../models/user");
const passport = require("passport");
const PhanQuyen = require("../models/PhanQuyen");
const order = require("../models/order");
const saltRounds = 12;
exports.admin =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    lienhe.find()
    .then(lienher => {
    pro.aggregate([ { $match: {} }, { $group:
      { _id : null, sum : { $sum: "$stock" } }
    }])
    .then(total=>{
      pro.aggregate([{ $group:
        { _id : '$productType', sum : { $sum: "$stock" } }
      }])
      .then(totalcates=>{
        order.aggregate([{ $group:
          { _id : 'null', sum : { $sum: "$cart.totalPrice" } }
        }])
        .then(totalcart=>{
          Users.countDocuments()
          .then(totaluser=>{
            order.countDocuments()
            .then(totaloder=>{
     res.render("front-end/admin/main/index", {
            user: req.user,
            total:total[0].sum,
            totaloder:totaloder,
            totaluser:totaluser,
            lienher: lienher,
            totalcart:totalcart[0].sum,
            title: "Quản Lý",
            PhanQuyen:phanquyen,
    })
  })
})
  })
  })
  })
})
  })
}
exports.getproductadd =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  pro.find()
  .then(product => {
    cate.find()
      .then(cates => {
        NCC.find()
      .then(ncc => {
        res.render("front-end/admin/product/them", {
          product:product ,
          cates: cates,
          ncc:ncc,  
          title: "Thêm Sản Phẩm",
          user:req.user,
          PhanQuyen:phanquyen,
          message: req.flash('message'), 
          success_msg:req.flash('success_msg'),
        });
      });
    })
  })
  })
  .catch(err => {
    console.log(err);
  });
  
}
exports.getcateall =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    cate.find()
    .then(cates => {
    res.render("front-end/admin/cate/danhsach", {
           user: req.user,
           catetype: cates,
           title: "Danh Sách Loại sản phẩm",
           PhanQuyen:phanquyen,
           success_msg:req.flash('success_msg'),
          
   })
  })
})
}
exports.getcateadd =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    res.render("front-end/admin/cate/them", {
           user: req.user,
           PhanQuyen:phanquyen,
           success_msg:req.flash('success_msg'), 
           title: "Thêm Loại Sản phẩm",
           message: req.flash('message'), 
   })
  })
}
exports.deletecate =  function (req, res,next){
  cate.findById(req.params.id).remove(function() { 
		req.flash('success_msg', 'Đã Xoá Thành Công');
		res.redirect('../getcateall');
	});
  
}
exports.getcateupdate =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  cate.findById(req.params.id, function(err, cates){
    res.render("front-end/admin/cate/sua", {
           user: req.user,
           PhanQuyen:phanquyen,
           cates:cates,
           title: "Cập nhật loại sản phẩm",
           message: req.flash('message'), 
   })
  })
})
  
}
exports.postcateadd = function(req, res,next){
  upload(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){           
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect("./getcateadd");
    }else{
      req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
          req.flash('message',messages);
          res.redirect('./getcateadd');
      }else{
    console.log(req.file);
    var pro = new cate()
    pro.name = req.body.name,
    pro.images = req.file.filename;
    pro.save(function (err) {
      if(err)
        console.log(err);
      else
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('./getcateadd');
    });
  }
}
})

}
exports.postcateupdate = (req, res, next) => {
  upload(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
      cate.findById(req.params.id, function(err, data){
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./'+req.params.id);
      })          
    }else{
      req.checkBody('name', 'Giá Trị không được rổng').notEmpty();
      req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
        cate.findById(req.params.id, function(err, data){
          req.flash('message',messages);
          res.redirect('./'+req.params.id);
        })
        
      }else{
        cate.findById(req.params.id, function(err, data){
        data.name 			= req.body.name;
        data.images = req.file.filename;
        data.save();
        req.flash('success_msg', 'Đã Sửa Thành Công');
        res.redirect('../getcateall');
      });
      }
    }
})
}
exports.postproductadd = function(req, res,next){
  uploads(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){           
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect("./getproductadd");
    }else{
      req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('description','Mô tả sản phẩm phải dài hơn 20 kí tự').isLength({min:20});
      req.checkBody('price','giá thì phải là số chứ').isInt();
      req.checkBody('stock','vui lòng nhập số hàng').isInt();
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
          req.flash('message',messages);
          res.redirect('./getproductadd');
      }else{
    console.log(req.file);
    var prod = new pro()
    prod.name = req.body.name,
    prod.images = req.file.filename;
    prod.productType = req.body.productType,
    prod.NhaCungCap = req.body.NhaCungCap,
    prod.price = req.body.price,
    prod.color = req.body.color,
    prod.description = req.body.description,
    prod.stock = req.body.stock,
    prod.thongtin.video=req.body.video,
    prod.thongtin.HangSanXuat= req.body.HangSanXuat,
    prod.thongtin.KichThuocManHinh= req.body.KichThuocManHinh,
    prod.thongtin.DoPhanGiaiManHinh= req.body.DoPhanGiaiManHinh,
    prod.thongtin.HeDieuHanh= req.body.HeDieuHanh,
    prod.thongtin.ChipXuLy= req.body.ChipXuLy,
    prod.thongtin.Ram= req.body.Ram,
    prod.thongtin.MayAnh= req.body.MayAnh,
    prod.thongtin.BoNhoTrong= req.body.BoNhoTrong,
    prod.thongtin.DungLuongPin= req.body.DungLuongPin,
    prod.PhuKienDiKem.p1= req.body.p1,
    prod.PhuKienDiKem.p2= req.body.p2,
    prod.PhuKienDiKem.p3= req.body.p3,
    prod.PhuKienDiKem.p4= req.body.p4,
    prod.PhuKienDiKem.p5= req.body.p5,
    prod.PhuKienDiKem.p6= req.body.p6,
    prod.TinhNangMoi.t1= req.body.t1,
    prod.TinhNangMoi.t2= req.body.t2,
    prod.TinhNangMoi.t3= req.body.t3,
    prod.TinhNangMoi.t4= req.body.t4,
    prod.TinhNangMoi.t5= req.body.t5,


    prod.save(function (err) {
      if(err)
        console.log(err);
      else
      req.flash('success_msg', 'Đã thêm Thành Công');
        res.redirect('./getproductadd');
    });
  }
}
})

}
exports.getproductall =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    pro.count({})
    .then(total=>{
  pro.find()
  .populate("productType")
  .populate("NhaCungCap")
  .exec()
  .then(pros => {
    res.render("front-end/admin/product/danhsach", {
           user: req.user,
           prod:pros,
           total:total,
           title: "danh sách sản phẩm",
           PhanQuyen:phanquyen,
           success_msg:req.flash('success_msg'),
})
})
    })
  })
}
exports.getproductupdate =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  pro.findById(req.params.id)
  .then(product => {
    cate.find()
    .then(cates => {
    res.render("front-end/admin/product/sua", {
           user: req.user,
           product:product,
           PhanQuyen:phanquyen,
           title: "cập nhật sản phẩm",
           cates:cates, 
           message: req.flash('message'), 
})
})
  })
})
}
exports.postproductupdate = (req, res, next) => {
  uploads(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
      pro.findById(req.params.id, function(err, data){
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./'+req.params.id);
      })          
    }else{
      req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('description','Mô tả sản phẩm phải dài hơn 20 kí tự').isLength({min:20});
      req.checkBody('price','giá thì phải là số chứ').isInt();
      req.checkBody('stock','vui lòng nhập số hàng').isInt();
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
        pro.findById(req.params.id).then(function(data){
          cate.find().then(function(cates){
          req.flash('message',messages);
          res.redirect('./'+req.params.id);
        })
      })
        
      }else{
        pro.findById(req.params.id, function(err, prod){

          prod.name = req.body.name,
          prod.images = req.file.filename;
          prod.productType = req.body.productType,
          prod.price = req.body.price,
          prod.description = req.body.description,
          prod.stock = req.body.stock,
          prod.thongtin.video=req.body.video,
          prod.thongtin.HangSanXuat= req.body.HangSanXuat,
    prod.thongtin.KichThuocManHinh= req.body.KichThuocManHinh,
    prod.thongtin.DoPhanGiaiManHinh= req.body.DoPhanGiaiManHinh,
    prod.thongtin.HeDieuHanh= req.body.HeDieuHanh,
    prod.thongtin.ChipXuLy= req.body.ChipXuLy,
    prod.thongtin.Ram= req.body.Ram,
    prod.thongtin.MayAnh= req.body.MayAnh,
    prod.thongtin.BoNhoTrong= req.body.BoNhoTrong,
    prod.thongtin.DungLuongPin= req.body.DungLuongPin,
    prod.PhuKienDiKem.p1= req.body.p1,
    prod.PhuKienDiKem.p2= req.body.p2,
    prod.PhuKienDiKem.p3= req.body.p3,
    prod.PhuKienDiKem.p4= req.body.p4,
    prod.PhuKienDiKem.p5= req.body.p5,
    prod.PhuKienDiKem.p6= req.body.p6,
    prod.TinhNangMoi.t1= req.body.t1,
    prod.TinhNangMoi.t2= req.body.t2,
         prod.TinhNangMoi.t3= req.body.t3,
          prod.TinhNangMoi.t4= req.body.t4,
          prod.TinhNangMoi.t5= req.body.t5,
          prod.save(function (err) {
            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash('success_msg', 'Đã Sửa Thành Công');
            res.redirect('../getproductall');
          });
        
      });
      }
    }
})
}
exports.deleteproduct =  function (req, res,next){
  pro.findById(req.params.id).remove(function() { 
		req.flash('success_msg', 'Đã Xoá Thành Công');
		res.redirect('../getproductall');
	});
  
}
exports.getuserall = (req, res, next) => {
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    Users.find()
    .populate("PhanQuyen")
    .exec()
    .then(users => {
          res.render("front-end/admin/user/danhsach", {
            prouser: users,
            user: req.user,
            PhanQuyen:phanquyen,
            title: "Quản lý Thành Viên",
          
          });
        });

})
}
exports.getuseradd = (req, res, next) => {
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    PhanQuyen.find()
    .then(quyen => {
        res.render("front-end/admin/user/them", {
          quyen:quyen,
          user: req.user,
          PhanQuyen:phanquyen,
          message:req.flash("message"),
          title: "Thêm Thành Viên",
          success_msg:req.flash("success_msg"),
        });
    })
  })
}
  exports.postuseradd = (req, res, next) => {
    uploaduser(req, res, function (err) {
      if(req.file == null || req.file == undefined || req.file == ""){ 
          req.flash('message','File bạn tải lên không hợp lệ');
          res.redirect('/register');
               
      }else{
    passport.authenticate("admin-register", {
      successReturnToOrRedirect: "./getuseradd",
      failureRedirect: "./getuseradd",
      failureFlash: true
    })(req, res, next);
  }})
  }
  exports.getuserupdate =  function (req, res,next){
    PhanQuyen.find({_id:req.user.PhanQuyen})
    .then(phanquyen =>{
    Users.findById(req.params.id)
    .then(users => {
      PhanQuyen.find()
      .then(phq => {
    res.render("front-end/admin/user/sua", {
           user: req.user,
           users:users,
           PhanQuyen:phanquyen,
           phq:phq,
           success_msg:req.flash('success_msg'),
           message: req.flash('message'), 
    })
    })
  })
   })
}
exports.postuserupdate = (req, res, next) => {
  uploaduser(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
      Users.findById(req.params.id, function(err, data){
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./'+req.params.id);
      })          
    }else{
      let user = {};
        user.password2 = req.password2;
          req.checkBody('username','tên đăng nhập phải có ít nhất 3 kí tự').isLength({min:3});
          req.checkBody('username','tên đăng nhập phải có ít hơn 20 kí tự').isLength({max:20});
          req.checkBody("email", "Email không hợp lệ").matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/); 
          req.checkBody('password', 'mật khẩu phải có ít nhất 3 kí tự').isLength({min:3});
          req.checkBody('password','mật khẩu phải có ít hơn 16 kí tự').isLength({max:15});
          req.checkBody('password2', "nhập lại mật khẩu không đúng").equals(req.body.password);
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
        Users.findById(req.params.id).then(function(data){
          PhanQuyen.find().then(function(phanquyen){
          req.flash('message',messages);
          res.redirect('./'+req.params.id);
        })
      })

      }else{
        Users.findById(req.params.id, function(err, user){
          bcrypt.hash(req.body.password, 12).then(hashPassword => {
          user.username = req.body.username,
          user.password = hashPassword,
          user.images = req.file.filename,
          user.fullname = req.body.fullname,
          user.email = req.body.email,
          user.address = req.body.address,
          user.phoneNumber = req.body.phoneNumber,
          user.PhanQuyen = req.body.PhanQuyen,  
          user.save(function (err) {
            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash('success_msg', 'Đã Sửa Thành Công');
            res.redirect('../getuserall');
          });
        })
        
      });
      }
    }
})
}
exports.deleteuser =  function (req, res,next){
  Users.findById(req.params.id).remove(function() { 
		req.flash('success_msg', 'Đã Xoá Thành Công');
		res.redirect('../getuserall');
	});
  
}
  exports.getnccadd =  function (req, res,next){
    PhanQuyen.find({_id:req.user.PhanQuyen})
    .then(phanquyen =>{
    res.render("front-end/admin/ncc/them", {
           user: req.user,
           PhanQuyen:phanquyen,
           title: "Thêm Nhà Cung Cấp",
           success_msg:req.flash('success_msg'),
           message: req.flash('message'), 
   })
  })
}

exports.postnccadd = function(req, res,next){
      req.checkBody('CongTy', 'Công Ty phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('DiaChi', 'Địa Chỉ phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('Phone', 'Số Điện Thoại phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('website', 'webstie phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('PhanPhoi', 'Phân Phối phải 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
          req.flash('error',messages);
          res.redirect('./getnccadd');
      }else{
    var ncc = new NCC()
    ncc.CongTy = req.body.CongTy,
    ncc.DiaChi = req.body.DiaChi;
    ncc.Phone = req.body.Phone;
    ncc.website = req.body.website;
    ncc.PhanPhoi = req.body.PhanPhoi;
    
    ncc.save(function (err) {
      if(err)
        console.log(err);
      else
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('back');
    });
  }

}
exports.getnccupdate =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  NCC.findById(req.params.id, function(err, ncc){
    res.render("front-end/admin/ncc/sua", {
           user: req.user,
           ncc:ncc, 
           title: "Cập Nhật Nhà Cung Cấp",
           PhanQuyen:phanquyen,
           message: req.flash('message'), 
   })
  })
})
  
}
exports.getnccall =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  NCC.find()
  .then(ncc=>{
    res.render("front-end/admin/ncc/danhsach", {
           user: req.user,
           ncc:ncc, 
           PhanQuyen:phanquyen,
           title: "Danh Sách Nhà Cung Cấp",
           success_msg:req.flash('success_msg'),
           message: req.flash('message'), 
   })
  })
})
  
}

exports.postnccupdate = (req, res, next) => {
      req.checkBody('CongTy', 'Công Ty phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('DiaChi', 'Địa Chỉ phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('Phone', 'Số Điện Thoại phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('website', 'webstie phải 5 đến 32 ký tự').isLength({min:3, max:52});
      req.checkBody('PhanPhoi', 'Phân Phối phải 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });
          req.flash('error',messages);
          res.redirect('./'+req.params.id);
      }else{
        NCC.findById(req.params.id, function(err, ncc){
          ncc.CongTy = req.body.CongTy,
          ncc.DiaChi = req.body.DiaChi;
          ncc.Phone = req.body.Phone;
          ncc.website = req.body.website;
          ncc.PhanPhoi = req.body.PhanPhoi;
          ncc.save(function (err) {

            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash('success_msg', 'Đã Sửa Thành Công');
            res.redirect('../getnccall');
          });
        })
      }
}
exports.deletencc =  function (req, res,next){
  NCC.findById(req.params.id).remove(function() { 
		req.flash('success_msg', 'Đã Xoá Thành Công');
		res.redirect('../getnccall');
	});
  
}
exports.getbanneradd =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  res.render("front-end/admin/ncc/them", {
         user: req.user,
         PhanQuyen:phanquyen,
         title: "Thêm Banner",
         success_msg:req.flash('success_msg'),
         message: req.flash('message'), 
 })
})
}

exports.postbanneradd = function(req, res,next){
  uploadbanner(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./getbanneradd'); 
    }else{
    req.checkBody('TenBanner', 'Công Ty phải 5 đến 32 ký tự').isLength({min:3, max:52});
    var errors = req.validationErrors();
    if(errors){
      var messages =[];
      errors.forEach(function(error){
        messages.push(error.msg)
      });
        req.flash('error',messages);
        res.redirect('./getbanneradd');
    }else{
  var bn = new banner()
  bn.TenBanner = req.body.TenBanner,
  bn.images = req.file.filename,
  bn.MoTa = req.body.MoTa
  bn.save(function (err) {
    if(err)
      console.log(err);
    else
      req.flash('success_msg', 'Đã Thêm Thành Công');
      res.redirect('./getbanneradd');
  });
}
    }})

}
exports.getbannerupdate =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
cate.findById(req.params.id, function(err, cates){
  res.render("front-end/admin/ncc/sua", {
         user: req.user,
         cates:cates, 
         title: "Cập Nhật banner",  
         PhanQuyen:phanquyen,
         message: req.flash('message'), 
 })
})
  })

}
exports.postbannerupdate = (req, res, next) => {
  uploadbanner(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
      banner.findById(req.params.id, function(err, data){
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./'+req.params.id);
      })          
    }else{
      req.checkBody('TenBanner', 'Công Ty phải 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });

      }else{
        banner.findById(req.params.id, function(err, bn){
          bn.TenBanner = req.body.TenBanner,
          bn.images = req.file.filename,
          bn.MoTa = req.body.MoTa
          
          bn.save(function (err) {

            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash('success_msg', 'Đã Sửa Thành Công');
            res.redirect('../getbannerall');
          });
        
      });
      }
    }
})
}
exports.deletebanner =  function (req, res,next){
banner.findById(req.params.id).remove(function() { 
  req.flash('success_msg', 'Đã Xoá Thành Công');
  res.redirect('../getbannerall');
});

}
exports.getslideradd =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
  res.render("front-end/admin/ncc/them", {
         user: req.user,
         title: "Thêm slider",
         PhanQuyen:phanquyen,
         success_msg:req.flash('success_msg'),
         message: req.flash('message'), 
 })
})
}

exports.postsliderradd = function(req, res,next){
  uploadslider(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./getslideradd'); 
    }else{
    req.checkBody('TenSlider', 'Tên Slider phải 5 đến 32 ký tự').isLength({min:3, max:52});
    var errors = req.validationErrors();
    if(errors){
      var messages =[];
      errors.forEach(function(error){
        messages.push(error.msg)
      });
        req.flash('error',messages);
        res.redirect('./getslideradd');
    }else{
  var bn = new slider()
  bn.TenSlider = req.body.TenSlide,
  bn.images = req.file.filename,
  bn.save(function (err) {
    if(err)
      console.log(err);
    else
      req.flash('success_msg', 'Đã Thêm Thành Công');
      res.redirect('./getbanneradd');
  });
}
    }})

}
exports.getsliderupdate =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
cate.findById(req.params.id, function(err, cates){
  res.render("front-end/admin/ncc/sua", {
         user: req.user,
         cates:cates, 
         title: "Cập Nhật Banner",
         PhanQuyen:phanquyen,
         message: req.flash('message'), 
 })
})
})

}
exports.postsliderupdate = (req, res, next) => {
  uploadslider(req, res, function (err) {
    if(req.file == null || req.file == undefined || req.file == ""){ 
      slider.findById(req.params.id, function(err, data){
        req.flash('message','File bạn tải lên không hợp lệ');
        res.redirect('./'+req.params.id);
      })          
    }else{
      req.checkBody('TenSlider', 'Tên Slider phải 5 đến 32 ký tự').isLength({min:3, max:52});
      var errors = req.validationErrors();
      if(errors){
        var messages =[];
        errors.forEach(function(error){
          messages.push(error.msg)
        });

      }else{
        slider.findById(req.params.id, function(err, bn){
          bn.TenSlider = req.body.TenSlide,
          bn.images = req.file.filename,
          
          bn.save(function (err) {

            if(err)
            req.flash("message","Thất bại"),
              console.log(err);
            else
            req.flash('success_msg', 'Đã Sửa Thành Công');
            res.redirect('../getsliderall');
          });
        
      });
      }
    }
})
}
exports.deleteslider =  function (req, res,next){
slider.findById(req.params.id).remove(function() { 
  req.flash('success_msg', 'Đã Xoá Thành Công');
  res.redirect('../getsliderall');
});

}
exports.getdonhang =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    order.find()
    .populate("user")
    .then(odr=>{
  res.render("front-end/admin/cart/danhsach", {
         user: req.user,
         odr:odr,
         title: "Danh Sách Đơn Hàng",
         PhanQuyen:phanquyen,
         success_msg:req.flash('success_msg'),
         message: req.flash('message'), 
 })
})
})
}
exports.xemdonhang =  function (req, res,next){
  PhanQuyen.find({_id:req.user.PhanQuyen})
  .then(phanquyen =>{
    order.findById(req.params.id)
    .then(odr=>{
  res.render("front-end/admin/cart/view", {
         user: req.user,
         odr:odr,
         alldanhsach: odr.danhsachsanpham,
         PhanQuyen:phanquyen,
         title: "Chi Tiết Đơn Hàng",
         success_msg:req.flash('success_msg'),
         message: req.flash('message'), 
 })
})
})
}
exports.addthanhtoan =  function (req, res,next){
  order.findById(req.params.id, function(err, odr){
    odr.trangthai = 1;
    odr.save();
    req.flash('success_msg', 'Đã Thanh Toán');
    res.redirect('../getcartall');
  });
  }
  exports.deletethanhtoan =  function (req, res,next){
    order.findById(req.params.id).remove(function() { 
      req.flash('success_msg', 'Đã Xoá Thành Công');
      res.redirect('../getcartall');
    });
  }
