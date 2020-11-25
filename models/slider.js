const mongoose = require('mongoose')
const SliderSchema = new mongoose.Schema({
  TenSlider: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },

})
module.exports = mongoose.model('slider', SliderSchema)