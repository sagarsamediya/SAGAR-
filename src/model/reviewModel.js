const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.type.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: { type: ObjectId, required: true, ref: "book",trim:true},

    reviewedBy: { type: String, required: true, default: 'Guest', value: String,trim:true },

    reviewedAt: { type: Date, required: true,trim:true },

    rating: { type: number, required: true,trim:true }, //rating 1-5 dena hai

    review: { type: String,trim:true },

    isDeleted: { type: Boolean, default: false ,trim:true},

}, { timestamps: true })

module.exports = mongoose.Model('review', reviewSchema)