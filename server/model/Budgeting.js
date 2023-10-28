const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BudgetingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: Date,
    endDate: Date,
    totalAmount: Number,
    categories: [{
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        allocatedAmount: Number
    }],
    currency: String,
    remainingAmount: Number,
    status: String,
    goals: [{
        description: String,
        targetAmount: Number
    }],
    notes: String,
    budgetType: String
}, {timestamps: true})

module.exports = mongoose.model('Budgeting', BudgetingSchema)