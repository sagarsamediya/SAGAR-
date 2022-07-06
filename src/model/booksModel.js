const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.type.ObjectId

const booksSchema = new mongoose.Schema({

    title: { type: string, required: true, unique: true },

    excerpt: { type: string, required: true },

    userId: { type: ObjectId, required: true, ref: "user" },

    ISBN: { type: string, required: true, unique: true },

    category: { type: string, required: true },

    subcategory: [{ type: string, required: true }],

    reviews: { type: number, default: 0 },

    deletedAt: { type: Date },

    isDeleted: { type: Boolean, default: false },

    releasedAt: { type: Date, required: true, format: "YYYY-MM-DD" },

}, { timestamps: true })

module.exports = mongoose.Model('book', booksSchema)

