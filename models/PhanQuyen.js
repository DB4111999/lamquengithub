const mongoose = require('mongoose')
const user = require('./user')

const PhanQuyenSchema = new mongoose.Schema({
      TenQuyen:{
      type:String,
      required: false
  },
  TenKhongDau:{
    type:String,
      required: false
  }
})
PhanQuyenSchema.pre('remove', function(next) {
    user.find({ PhanQuyen: this.id }, (err, users) => {
    if (err) {
      next(err)
    } else if (users.length > 0) {
      next(new Error('This Phân Quyền'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model('PhanQuyen', PhanQuyenSchema)