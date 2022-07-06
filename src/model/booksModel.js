const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.type.ObjectId

const booksSchema = new mongoose.Schema({

    title: { type: String, required: true, unique: true,trim:true },

    excerpt: { type: String, required: true,trim:true },

    userId: { type: ObjectId, required: true, ref: "user",trim:true },

    ISBN: { type: String, required: true, unique: true,trim:true },

    category: { type: String, required: true,trim:true },

    subcategory: [{ type: String, required: true,trim:true }],

    reviews: { type: number, default: 0 ,trim:true}, // 1-10

    deletedAt: { type: Date },

    isDeleted: { type: Boolean, default: false},

    releasedAt: { type: Date, required: true},

}, { timestamps: true })

module.exports = mongoose.Model('book', booksSchema)

