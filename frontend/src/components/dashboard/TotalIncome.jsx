import React from 'react'
import { ResponsiveLine  } from '@nivo/line'

const TotalIncome = ({ incomeData }) => {

    if (!incomeData || incomeData.length === 0) {
        return (
            <div>
                <h2>No income data availabe for the current year</h2>
            </div>
        )
    }
    
    const currentYear = new Date().getFullYear()

    // Group income data by month and calculate total income for each month
    const monthlyIncome = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const monthData = incomeData.filter(inc => new Date(inc.dateReceived).getFullYear() === currentYear && new Date(inc.dateReceived).getMonth() === i)
        const totalIncome = monthData.reduce((total, inc) => total + inc.amount, 0)
        return { month, totalIncome }
    })

    // Prepare data for line chart
    const chartData = [
        {
            id: 'Total Income',
            data: monthlyIncome.map(inc => ({ x: inc.month, y: inc.totalIncome }))
        }
    ]

    return (
        <div>
            <h2>Total Income for {currentYear} </h2>
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

export default TotalIncome