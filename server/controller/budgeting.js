const Budgeting = require('../model/Budgeting')

const createTest = async (req, res) => {
    try {
        const { name, startDate, endDate, totalAmount, categories, currency, remainingAmount, status, goals, notes, budgetType } = req.body

        const budgetings = new Budgeting({
            userId: req.user._id,
            name,
            startDate,
            endDate,
            totalAmount,
            categories,
            currency,
            remainingAmount,
            status,
            goals,
            notes,
            budgetType
        })

        await budgetings.save()
        return res.status(201).json({ budgetings })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getTestByUser = async (req, res) => {
    try{
        const { _id } = req.user
        const budgetingsByUser = await Budgeting.find({ userId: _id }).populate('categories.categoryId').exec()
        return res.status(200).json({ budgetingsByUser })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const updateBudgetings = async (req, res) => {
    try {
        const { budgetId } = req.params
        const updateData = req.body

        const updatedBudgeting = await Budgeting.findByIdAndUpdate(budgetId, updateData, { new: true })
        if(!updatedBudgeting) {
            return res.status(404).json({ error: 'Budget not found' })
        }
        return res.status(200).json({ budget: updatedBudgeting })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const deleteBudgetings = async (req, res) => {
    try {
        const { budgetId } = req.params
        const result = await Budgeting.deleteOne({ _id: budgetId})
        if (!result) {
            return res.status(404).json({ messag: 'Budget not found' })
        }
        res.status(200).json({ message: 'Budget deleted' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const addGoalToBudgeting = async (req, res) => {
    try {
        const { budgetId } = req.params
        const { description, targetAmount } = req.body

        const budgeting = await Budgeting.findById(budgetId)

        if (!budgeting) {
            return res.status(400).json({ error: 'Budget does not exist' })
        }
        budgeting.goals.push({ description, targetAmount })
        await budgeting.save()

        return res.status(200).json({ budgeting })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while adding goals"})
    }
}

const deleteGoals = async (req, res) => {
    try {
        const { budgetId, goalId } = req.params
        
        const budgeting = await Budgeting.findById(budgetId)
        if (!budgeting) {
            return res.status(400),json({ error: 'Budget does not exist' })
        }
        const goalIndex = budgeting.goals.findIndex(
            (goal) => goal._id.toString() === goalId
        )
        const deletedGoal = budgeting.goals[goalIndex]
        budgeting.goals.splice(goalIndex, 1)

        await budgeting.save()
        return res.status(200).json({ message: "Goal deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while getting goals from user"})
    }
}

const addCategoryToBudget = async (req, res) => {
    try {
        const { budgetId } = req.params
        const { categoryId, allocatedAmount } = req.body

        const budgeting = await Budgeting.findById(budgetId)

        if (!budgeting) {
            return res.status(400).json({ error: 'Budget does not exist' })
        }
        budgeting.categories.push({ categoryId, allocatedAmount })
        await budgeting.save()

        return res.status(200).json({ budgeting })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while adding categories"})
    }
}

module.exports = {
    createTest,
    getTestByUser,
    updateBudgetings,
    deleteBudgetings,
    addGoalToBudgeting,
    deleteGoals,
    addCategoryToBudget
}
