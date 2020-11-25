const mongoose = require('mongoose')
const BannerSchema = new mongoose.Schema({
  TenBanner: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },
  MoTa:{
    type:String,
    require:true,
  }
})
module.exports = mongoose.model('banner', BannerSchema)