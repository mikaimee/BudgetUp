const Income = require('../model/Income')

const createIncome = async (req, res) => {
    try {
        const { source, amount, frequency, dateReceived, isRecurring, categoryId, description } = req.body

        const income = new Income({
            userId: req.user._id,
            source,
            amount,
            frequency,
            dateReceived,
            isRecurring,
            categoryId,
            description
        })

        await income.save()
        return res.status(201).json({ income })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateIncome = async (req, res) => {
    try {
        const { incomeId } = req.params
        const updatedIncomeData = req.body

        const updatedIncome = await Income.findByIdAndUpdate(incomeId, updatedIncomeData, { new: true })

        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income not found' })
        }
        return res.status(200).json({ income: updatedIncome })
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteIncome = async (req, res) => {
    try {
        const { incomeId } = req.params
        const result = await Income.deleteOne({ _id: incomeId })
        if (!result) {
            return res.status(404).json({ message: 'Income not found' })
        }
        res.status(200).json({ messgae: "Income deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting income"})
    }
}

const getAllIncomeByUser = async (req, res) => {
    try{
        const { _id } = req.user
        const incomeRecords = await Income.find({ userId: _id })
        return res.status(200).json({ incomeRecords })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retrieving all income of user"})
    }
}

const filterIncomeByDateRange = async (req, res) => {
    try {
        const { _id } = req.user
        const { startDate, endDate } = req.query

        const incomeRecords = await Income.find({
            userId: _id,
            dateReceived: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        return res.status(200).json({ incomeRecords })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while filtering"})
    }
}

const calculateTotalIncomeByDateRange = async (req, res) => {
    try {
        const { _id } = req.user
        const { startDate, endDate } = req.query

        const totalIncome = await Income.aggregate([
            {
                $match: {
                    userId: _id,
                    dateReceived: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$amount' }
                }
            }
        ])
        if (totalIncome.length === 0) {
            return res.status(404).json({ message: 'No income records found within the specified date range' })
        }
        return res.status(200).json({ totalIncome: totalIncome[0].totalIncome })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while calculating"})
    }
}

const searchIncome = async (req, res) => {
    try {
        const { _id } = req.user
        const { keyword } = req.query

        const searchResults = await Income.find({
            userId: _id,
            $or: [
                { source: { $regex: keyword, $options: 'i' } },
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

const groupIncomeByCategory = async (req, res) => {
    try {
        const incomeCategories = await Income.aggregate([
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
        return res.status(200).json({ incomeCategories })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting the group income"})
    }
}


module.exports = {
    createIncome,
    updateIncome,
    deleteIncome,
    getAllIncomeByUser,
    filterIncomeByDateRange,
    calculateTotalIncomeByDateRange,
    searchIncome,
    groupIncomeByCategory
}
