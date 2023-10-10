const Expense = require('../model/Expense')

const createExpense = async (req, res) => {
    try {
        const { vendor, amount, method, dateOfExpense, isRecurring, categoryId } = req.body
        
        const dobParts = dateOfExpense.split('/')
            if (dobParts.length !== 3) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const month = parseInt(dobParts[0], 10)
            const day = parseInt(dobParts[1], 10)
            const year = parseInt(dobParts[2], 10)
            if (isNaN(month) || isNaN(day) || isNaN(year)) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const parsedDate = new Date(year, month - 1, day)

        const expense = new Expense({
            userId: req.user._id,
            vendor,
            amount,
            method,
            dateOfExpense: parsedDate,
            isRecurring,
            categoryId
        })

        await expense.save()
        return res.status(201).json({ expense })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateExpense = async (req, res) => {
    try {
        const { expenseId } = req.params
        const updatedExpenseData = req.body

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updatedExpenseData, { new: true })

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' })
        }
        return res.status(200).json({ expense: updatedExpense })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params
        const result = await Expense.deleteOne({ _id: expenseId })
        if (!result) {
            return res.status(404).json({ message: 'Expense not found' })
        }
        res.status(200).json({ messgae: "Expense deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting expense"})
    }
}

const getAllExpenseByUser = async (req, res) => {
    try{
        const { _id } = req.user
        const expenseRecords = await Expense.find({ userId: _id })
        return res.status(200).json({ expenseRecords })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retrieving all expense of user"})
    }
}

const filterExpenseByDateRange = async (req, res) => {
    try {
        const { _id } = req.user
        const { startDate, endDate } = req.query

        const expenseRecords = await Expense.find({
            userId: _id,
            dateOfExpense: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        return res.status(200).json({ expenseRecords })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while filtering"})
    }
}

const calculateTotalExpenseByDateRange = async (req, res) => {
    try {
        const { _id } = req.user
        const { startDate, endDate } = req.query

        const totalExpense = await Expense.aggregate([
            {
                $match: {
                    userId: _id,
                    dateOfExpense: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: '$amount' }
                }
            }
        ])
        if (totalExpense.length === 0) {
            return res.status(404).json({ message: 'No expense records found within the specified date range' })
        }
        return res.status(200).json({ totalExpense: totalExpense[0].totalExpense })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while calculating"})
    }
}

const searchExpense = async (req, res) => {
    try {
        const { _id } = req.user
        const { keyword } = req.query

        const searchResults = await Expense.find({
            userId: _id,
            $or: [
                { vendor: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        })
        return res.status(200).json({ searchResults })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while searching"})
    }
}

const groupExpenseByCategory = async (req, res) => {
    try {
        const expenseCategories = await Expense.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category',
            },
            {
                $project: {
                    _id: 0,
                    categoryName: '$category.name',
                    totalAmount: 1
                }
            }
        ])
        return res.status(200).json({ expenseCategories })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting the group expense"})
    }
}


module.exports = {
    createExpense,
    updateExpense,
    deleteExpense,
    filterExpenseByDateRange,
    searchExpense,
    getAllExpenseByUser,
    calculateTotalExpenseByDateRange,
    groupExpenseByCategory
}