const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.type.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: { type: ObjectId, required: true, ref: "book" },

    reviewedBy: { type: string, required: true, default: 'Guest', value: string },

    reviewedAt: { type: Date, required: true },

    rating: { type: number, required: true }, //rating 1-5 dena hai

    review: { type: string, optional: true },

    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.Model('review', reviewSchema)