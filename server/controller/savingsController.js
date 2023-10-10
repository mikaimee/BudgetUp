const Savings = require('../model/Savings')

const createSavings = async (req, res) => {
    try {
        const { goalAmount, targetDate, currentAmount, status, contributions, categoryId, notes } = req.body
        
        const dobParts = targetDate.split('/')
            if (dobParts.length !== 3) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const month = parseInt(dobParts[0], 10)
            const day = parseInt(dobParts[1], 10)
            const year = parseInt(dobParts[2], 10)
            if (isNaN(month) || isNaN(day) || isNaN(year)) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const parsedTargetDate  = new Date(year, month - 1, day)

        const savings = new Savings({
            userId: req.user._id,
            goalAmount,
            currentAmount,
            targetDate: parsedTargetDate ,
            status,
            contributions,
            categoryId,
            notes
        })

        await savings.save()
        return res.status(201).json({ savings })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateSavings = async (req, res) => {
    try {
        const { savingsId } = req.params
        const updatedSavingsData = req.body

        const updatedSavings = await Savings.findByIdAndUpdate(savingsId, updatedSavingsData, { new: true })

        if (!updatedSavings) {
            return res.status(404).json({ message: 'Savings not found' })
        }
        return res.status(200).json({ savings: updatedSavings })
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteSavings = async (req, res) => {
    try {
        const { savingsId } = req.params
        const result = await Savings.deleteOne({ _id: savingsId })
        if (!result) {
            return res.status(404).json({ message: 'Savings not found' })
        }
        res.status(200).json({ messgae: "Savings deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting savings"})
    }
}

const listSavingGoalByUser = async (req, res) => {
    try{
        const userId = req.user._id
        const savingGoals = await Savings.find({ userId })
        return res.status(200).json({ savingGoals })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const filterSavings = async (req, res) => {
    try {
        const userId = req.user._id
        const { status, categoryId } = req.query

        const filter = { userId }
        if (status) {
            filter.status = status
        }
        if (categoryId) {
            filter.categoryId
        }
        const filteredSavings = await Savings.find(filter)
        return res.status(200).json({ savingsGoals: filteredSavings })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const groupSavingsByCategory = async (req, res) => {
    try {
        const savingsCategories = await Savings.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    totalAmount: { $sum: '$currentAmount' }
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
        return res.status(200).json({ savingsCategories })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting the group savings"})
    }
}

module.exports = {
    createSavings,
    updateSavings,
    deleteSavings,
    groupSavingsByCategory,
    filterSavings,
    listSavingGoalByUser
}
