const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   title: {
      type: String,
      require: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim:true
   },
   name: {
      type: String,
      require: true,
      trim:true
   },
   phone: {
      type: String,
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
      street: { type: String,trim:true},
      city: { type: String,trim:true },
      pincode: { type: String,trim:true }

   },


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)












