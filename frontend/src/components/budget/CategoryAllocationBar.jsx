import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ResponsiveBar } from "@nivo/bar"
import { useGetExpensesByUser } from '../../hooks/expenseHook'
import { Select, MenuItem } from '@mui/material'

const CategoryAllocationBar = ({ budgetData }) => {

    const userState = useSelector((state) => state.user)
    const [selectedBudget, setSelectedBudget] = useState(budgetData[0])

    const {
        data: expenseData,
        isLoading: expenseLoading,
        isError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    if (expenseLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching expenses</div>
    }
    
    console.log(selectedBudget)

    const budgetStartDate = new Date(selectedBudget.startDate)
    const budgetEndDate = new Date(selectedBudget.endDate)

    const chartData = selectedBudget.categories.map((c) => {
        const categoryId = c.categoryId._id
        const categoryName = c.categoryId.name
        const allocatedAmount = c.allocatedAmount

        // Filter expenses within the current budget's timeframe and with the matching categoryId
        const expensesWithinBudget = expenseData.filter((exp) => {
            const expenseCategoryId = exp.categoryId._id
            const expenseDate = new Date(exp.dateOfExpense)
            return (
                expenseDate >= budgetStartDate &&
                expenseDate <= budgetEndDate &&
                expenseCategoryId === categoryId
            )
        })

        // Calculate the total expense for category
        const totalExpense = expensesWithinBudget.reduce(
            (total, expense) => total + expense.amount, 0
        )

        return {
            category: categoryName,
            allocatedAmount,
            totalExpense
        }
    })

    // Define chart settings
    const chartSettings = {
        data: chartData,
        keys: ['allocatedAmount', 'totalExpense'],
        indexBy: 'category',
        margin: { top: 50, right: 130, bottom: 50, left: 60 },
        padding: 0.3,
        groupMode: 'grouped',
        axisBottom: {
            legend: 'Categories',
            legendPosition: 'middle',
            legendOffset: 32,
        },
        axisLeft: {
            legend: 'Amount',
            legendPosition: 'middle',
            legendOffset: -40,
        }
    }

    return (
        <div>
            <h2>Allocated Amount per Category vs. Expense</h2>
            <Select
                value={selectedBudget._id}
                onChange={(e) => {
                    const selectedBudgetId = e.target.value
                    const budget = budgetData.find((b) => b._id === selectedBudgetId)
                    setSelectedBudget(budget)
                }}
            >
                {budgetData.map((budget) => (
                    <MenuItem key={budget._id} value={budget._id}>
                        {budget.name}
                    </MenuItem>
                ))}
            </Select>
            <div style={{ height: '400px' }}>
                <ResponsiveBar 
                    {...chartSettings} 
                    colors={{ scheme: 'nivo' }}
                />
            </div>
        </div>
    )
}

export default CategoryAllocationBar