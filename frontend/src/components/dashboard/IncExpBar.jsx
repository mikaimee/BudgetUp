import React from 'react'
import { ResponsiveBar } from "@nivo/bar"

const IncExpBar = ({ incomeData, expenseData }) => {

    const currentYear = new Date().getFullYear()

    // Filter income and expense data for current year
    const filteredIncome = incomeData.filter(inc => new Date(inc.dateReceived).getFullYear())
    const filteredExpense = expenseData.filter(exp => new Date(exp.dateOfExpense).getFullYear())

    // Calculate monthly totals for income and expense
    const monthlyData = []
    for (let month = 0; month < 12; month++) {
        const monthName = new Date(currentYear, month, 1).toLocaleDateString('default', { month: 'short' })
    
        const totalIncomeForMonth = filteredIncome
            .filter(inc => new Date(inc.dateReceived).getMonth() === month)
            .reduce((total, inc) => total + inc.amount, 0)
        
        const totalExpenseForMonth = filteredExpense  
            .filter(exp => new Date(exp.dateOfExpense).getMonth() === month)
            .reduce((total, exp) => total + exp.amount, 0)
        
        monthlyData.push({
            month: monthName,
            totalIncome: totalIncomeForMonth,
            totalExpense: totalExpenseForMonth
        })

        console.log("MonthlyDATA: ", monthlyData)
    }

    // Configure the Bar Chart settings
    const chartSettings = {
        data: monthlyData,
        keys: ['totalIncome', 'totalExpense'],
        indexBy: 'month',
        margin: { top: 50, right: 130, bottom: 50, left: 60 },
        padding: 0.3,
        groupMode: 'grouped',
        axisBottom: {
            legend: 'Months',
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
            <h3>Income and Expense in {currentYear}</h3>
            <div style={{ height: '400px' }}>
                <ResponsiveBar {...chartSettings} />
            </div>
        </div>
    )
}

export default IncExpBar