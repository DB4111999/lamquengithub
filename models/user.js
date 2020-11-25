const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  images: {
    type:String,
    required: false
  },
  fullname: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  PhanQuyen: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'PhanQuyen'
  },
  isAuthenticated: {
    type: Boolean,
    required: false,
    default: false
  },
  isLock: {
    type: Boolean,
    required: false,
    default: false
  },
  verify_token: {
    type: String,
    required: false
  },
  cart: {
    type: Object,
    required: false
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
},
google           : {
    id           : String,  
    token        : String,
    email        : String,
    name         : String
}
});
const User = mongoose.model('User', userSchema);

module.exports = User;
