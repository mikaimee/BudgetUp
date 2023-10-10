const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SavingsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goalAmount: {
        type: Number,
        required: true
    },
    currentAmount: Number,
    targetDate: {
        type: Date,
        required: true
    },
    status: String,
    contributions: [{
        date: Date,
        amount: Number
    }],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    notes: String,
}, {timestamps: true})

module.exports = mongoose.model('Savings', SavingsSchema)