const mongoose = require('mongoose')
const product = require('./products')

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  images:{
      type:String,
      required: false
  }
})
productTypeSchema.pre('remove', function(next) {
    product.find({ productType: this.id }, (err, products) => {
    if (err) {
      next(err)
    } else if (products.length > 0) {
      next(new Error('This productType'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('productType', productTypeSchema)