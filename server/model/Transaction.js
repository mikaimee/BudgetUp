const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    type: {
        type: String, // 'income' or 'expense'
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
},)

module.exports = mongoose.model('Transaction', transactionSchema)