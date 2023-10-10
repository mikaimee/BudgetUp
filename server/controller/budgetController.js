const Budget = require('../model/Budget')

const createBudget = async (req, res) => {
    try {
        const {
            name,
            startDate,
            endDate,
            totalAmount,
            categories,
            currency,
            status,
            goals,
            notes,
            budgetType
        } = req.body

        const budget = new Budget({
            userId: req.user._id,
            name,
            startDate,
            endDate,
            totalAmount,
            categories,
            currency,
            status,
            goals,
            notes,
            budgetType
        })

        await budget.save()
        return res.status(201).json({ budget })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateBudget = async (req, res) => {
    try {
        const { budgetId } = req.params
        const updateData = req.body

        const updatedBudget = await Budget.findByIdAndUpdate(budgetId, updateData, { new: true })

        if (!updatedBudget) {
            return res.status(404).json({ error: 'Budget not found' })
        }

        return res.status(200).json({ budget: updatedBudget })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteBudget = async (req, res) => {
    try {
        const { budgetId } = req.params
        const result = await Budget.deleteOne({ _id: budgetId })
        if (!result) {
            return res.status(404).json({ message: 'Budget not found' })
        }
        res.status(200).json({ messgae: "Budget deleted successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting budget"})
    }
}

const getAllBudgetsByUser = async (req, res) => {
    try {
        const userId = req.user._id
        const budgets = await Budget.find({ userId })
        return res.status(200).json({ budgets })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getBudgetById = async (req, res) => {
    try {
        const { budgetId } = req.params
        const budget = await Budget.findById(budgetId)

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' })
        }

        return res.status(200).json({ budget })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const addGoalToBudget = async (req, res) => {
    try {
        const { budgetId } = req.params
        const { description, targetAmount } = req.body

        const budget = await Budget.findById(budgetId)

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' })
        }

        budget.goals.push({ description, targetAmount })
        await budget.save()

        return res.status(200).json({ budget })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const filterBudgets = async (req, res) => {
    try {
        const { userId } = req.user._id
        const { status, startDate, endDate, budgetType } = req.query

        const filterCriteria = {
            userId,
            // Apply filtering criteria as needed
            ...(status && { status }),
            ...(startDate && endDate && {
                startDate: { $gte: startDate },
                endDate: { $lte: endDate },
            }),
            ...(budgetType && { budgetType }),
        }

        const filteredBudgets = await Budget.find(filterCriteria)
        return res.status(200).json({ budgets: filteredBudgets })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
};

module.exports = {
    createBudget,
    updateBudget,
    deleteBudget,
    getAllBudgetsByUser,
    getBudgetById,
    addGoalToBudget,
    filterBudgets
}

