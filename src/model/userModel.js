const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   title: {
      type: string,
      require: true,
      enum: [Mr, Mrs, Miss]
   },
   name: {
      type: string,
      require: true
   },
   phone: {
      type: string,
      require: true,
      unique: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },


   password: {
      require: true,
      type: String,

   },
   address: {
      street: { type: string },
      city: { type: string },
      pincode: { type: string }
   },


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)












