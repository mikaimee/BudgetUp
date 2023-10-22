const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dateOfExpense: {
        type: Date,
        required: true
    },
    method: {
        type: String, 
        enum: ["Credit Card", "Cash", "Debit Card"]
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
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

ExpenseSchema.pre('save', async function (next) {
    const Transaction = mongoose.model('Transaction')
    const newTransaction = new Transaction({
        type: 'expense',
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

module.exports = mongoose.model('Expense', ExpenseSchema)