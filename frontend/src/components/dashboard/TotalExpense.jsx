import React from 'react'
import { ResponsiveLine  } from '@nivo/line'

const TotalExpense = ({ expenseData  }) => {

    if (!expenseData || expenseData.length === 0) {
        return (
            <div>
                <h2>No expense data availabe for the current year</h2>
            </div>
        )
    }
    
    const currentYear = new Date().getFullYear()

    // Group expense data by month and calculate total expense for each month
    const monthlyExpense = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const monthData = expenseData.filter(exp => new Date(exp.dateOfExpense).getFullYear() === currentYear && new Date(exp.dateOfExpense).getMonth() === i)
        const totalExpense = monthData.reduce((total, exp) => total + exp.amount, 0)
        return { month, totalExpense }
    })

    // Prepare data for line chart
    const chartData = [
        {
            id: 'Total Expense',
            data: monthlyExpense.map(exp => ({ x: exp.month, y: exp.totalExpense }))
        }
    ]

    return (
        <div>
            <h2>Total Expenses for {currentYear} </h2>
            <div style={{ width: '600px', height: '400px' }}>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    xFormat={(value) => {
                        const date = new Date(value);
                        return date.toLocaleString('default', { month: 'short' });
                    }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        legend: 'Month'
                    }}
                    axisLeft={{
                        legend: 'Total Income',
                        legendOffset: -40,
                        legendPosition: 'middle',
                    }}
                    colors={{ scheme: 'nivo' }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                />
            </div>
        </div>
    )
}

export default TotalExpense