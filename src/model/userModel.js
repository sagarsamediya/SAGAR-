const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim:true
   },
   name: {
      type: String,
      required: true,
      trim:true
   },
   phone: {
      type: String,
      required: true,
      unique: true,
      trim:true
   },
   email: {
      type: String,
      requiredd: true,
      unique: true,
      trim:true
   },


   password: {
      required: true,
      type: String,

   },
   address: {
      street: { type: String,trim:true},
      city: { type: String,trim:true },
      pincode: { type: String,trim:true }

   },


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)












