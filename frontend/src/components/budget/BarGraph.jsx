import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { ResponsiveBar } from "@nivo/bar"
import { useGetExpensesByUser } from '../../hooks/expenseHook'

const BarGraph = ({ budgetData }) => {

    const userState = useSelector((state) => state.user)

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

    const currentYear = new Date().getFullYear()

    // Define chart data
    const chartData = budgetData
        .filter((budget) => {
            const endDateYear = new Date(budget.endDate).getFullYear()
            return endDateYear === currentYear
        })
        .map((budget) => {
            const budgetStartDate = new Date(budget.startDate)
            const budgetEndDate = new Date(budget.endDate)

        // Filter expenses within current budget's timeframe
        const expensesWithinBudget = expenseData.filter((expense) => {
            const expenseDate = new Date(expense.dateOfExpense)
            return expenseDate >= budgetStartDate && expenseDate <= budgetEndDate
        })

        // Calculate total expenses within current budget's timeframe
        const totalExpensesWithinBudget = expensesWithinBudget.reduce(
            (total, expense) => total + expense.amount, 0
        )

        return {
            budgetName: budget.name,
            totalAmount: budget.totalAmount,
            totalExpense: totalExpensesWithinBudget
        }
    })

    // Define chart settings
    const chartSettings = {
        data: chartData,
        keys: ['totalAmount', 'totalExpense'],
        indexBy: 'budgetName',
        margin: { top: 50, right: 130, bottom: 50, left: 60 },
        padding: 0.3,
        groupMode: 'grouped',
        axisBottom: {
            legend: 'Budgets',
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
            <h2>Budget vs. Expense</h2>
            <div style={{ height: '400px' }}>
                <ResponsiveBar {...chartSettings} />
            </div>
        </div>
    )
}

export default BarGraph