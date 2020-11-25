const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  cart: { type: Object, required: true },
  address: {
    type: String,
    required: true
  },
  nguoinhan: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  loinhan: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  trangthai:{
    type:Number,
    require:false
  },
  danhsachsanpham:[]
});

module.exports = mongoose.model("Order", orderSchema);