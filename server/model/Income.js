const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IncomeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    dateReceived: {
        type: Date,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    description: String,
    currency: {
        type: String,
        default: 'USD'
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }
}, {timestamps: true})

IncomeSchema.pre('save', async function (next) {
    const Transaction = mongoose.model('Transaction')
    const newTransaction = new Transaction({
        type: 'income',
        amount: this.amount
    })
    try {
        await newTransaction.save()
        this.transaction = newTransaction._id
        next()
    }
    catch(error){  
        console.error(error.message)
    }
})

module.exports = mongoose.model('Income', IncomeSchema)