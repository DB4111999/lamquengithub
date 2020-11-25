const mongoose = require('mongoose')
const LienHeSchema = new mongoose.Schema({
  HoTen: {
    type: String,
    required: true
  },
  TieuDe: {
    type: String,
    required: true
  },
  BinhLuan:{
    type:String,
    require:true,
  },
  email:{
    type:String,
    require:true,
  }
})
module.exports = mongoose.model('lienhe', LienHeSchema)