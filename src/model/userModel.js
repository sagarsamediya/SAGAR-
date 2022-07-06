const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   title: {
      type: string,
      require: true,
      enum: [Mr, Mrs, Miss],
      trim:true
   },
   name: {
      type: string,
      require: true,
      trim:true
   },
   phone: {
      type: string,
      require: true,
      unique: true,
      trim:true
   },
   email: {
      type: String,
      required: true,
      unique: true,
      trim:true
   },


   password: {
      require: true,
      type: String,

   },
   address: {
      street: { type: string,trim:true},
      city: { type: string,trim:true },
      pincode: { type: string,trim:true }

   },


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)












