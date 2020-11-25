const mongoose = require('mongoose')
const product = require('./products')

const NhaCungCapSchema = new mongoose.Schema({
  CongTy: {
    type: String,
    required: true
  },
  DiaChi:{
      type:String,
      required: false
  },
  Phone:{
    type:String,
    required: false
},
website:{
    type:String,
    required: false
},
PhanPhoi:{
    type:String,
    required: false
}
})
NhaCungCapSchema.pre('remove', function(next) {
    product.find({ NhaCungCap: this.id }, (err, products) => {
    if (err) {
      next(err)
    } else if (products.length > 0) {
      next(new Error('This NhaCungCap'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('NhaCungCap', NhaCungCapSchema)