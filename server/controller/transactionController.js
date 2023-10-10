const Transaction = require('../model/Transaction')

const getAllTransactions = async (req, res) => {
    try {
        const userId = req.user._id
        const transactions = await Transaction.find({ userId })
        return res.status(200).json({ transactions })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error when retrieving' })
    }
}

const filterTransactionsByType = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type } = req.params; // 'income' or 'expense'

        const transactions = await Transaction.find({ userId, type });
        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error when filtering' });
    }
};

const filterTransactionsByDateRange = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;

        // Convert startDate and endDate to JavaScript Date objects if needed

        const transactions = await Transaction.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllTransactions,
    filterTransactionsByDateRange,
    filterTransactionsByType
}