
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        required: true
      },
      stock: {
        type: Number,
        required: true
      },
      color: {
        type: [String],
        required: true
      },
      images: {
        type: [String],
        required: true
      },
      dateAdded: {
        type: Date,
        required: false,
        default: Date.now
      },
      isSale: {
        status: {
          type: Boolean,
          default: false
        },
        percent: {
          type: Number,
          default: 0
        },
        end: {
          type: Date
        }
      },
      viewCounts: {
        type: Number,
        required: false,
        default: 0
      },
      rating: {
        byUser: String,
        content: String,
        star: Number
      },
      comment: {
        total: {
          type: Number,
          require: false,
          default: 0
        },
        items : [
          {
            title:  {
              type: String,
              require: true,
              
            },
            content:  {
              type: String,
              require: true,
             
            },
            name:  {
              type: String,
              require: true,
              
            },
            date: {
              type: String,
              require: true,
              
            },
            star:  {
              type: Number,
              require: true,
              
            },
          }
        ]
      },
      buyCounts: {
        type: Number,
        required: false,
        default: 0
      },
    thongtin:{
      video:String,
      HangSanXuat:String,
      KichThuocManHinh:String,
      DoPhanGiaiManHinh:String,
      HeDieuHanh:String,
      ChipXuLy:String,
      Ram:String,
      MayAnh:String,
      BoNhoTrong:String,
      DungLuongPin:String
    },
    TinhNangMoi:{
     t1:String,
     t2:String,
     t3:String,
     t4:String,
     t5:String,
    },
    PhuKienDiKem:{
      p1:String,
      p2:String,
      p3:String,
      p4:String,
      p5:String,
  
     },
    NhaCungCap: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'NhaCungCap'
    },
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'productType'
    },

});
     
const index = {
  name: "text",
  description: "text",
  labels: "text",
  "productType.main": "text",
  tags: "text",
  ofSellers: "text"
};
productSchema.index(index);

productSchema.methods.getNonAccentType = function() {
  return removeAccent(this.productType.main);
};
module.exports = mongoose.model('product', productSchema);


