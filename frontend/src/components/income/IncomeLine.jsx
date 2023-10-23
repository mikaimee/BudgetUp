import React from 'react'
import { ResponsiveLine  } from '@nivo/line'

const IncomeLine = ({ data }) => {

    if (!data || data.length === 0) {
        return (
            <div>
                <h2>No income data avalible for for the current year.</h2>
            </div>
        )
    }

    // Get current year
    const currentYear = new Date().getFullYear()

    // Data transformation for line chart
    const transformData = () => {
        // Craete array of month keys
        const months = Array.from({ length: 12 }, (_, i) => {
            return `${currentYear}-${String(i + 1).padStart(2, '0')}`
        })

        // Create object to store data points
        const categoryData = {}

        // Initialize categoryData with all months having zero values for each category
        data.forEach((inc) => {
            const categoryId = inc.categoryId._id
            const categoryName  = inc.categoryId.name

            if (!categoryData[categoryId]) {
                categoryData[categoryId] = { id: categoryName, data: [] };
            }

            // Create object for each month
            for (let month = 1; month <= 12; month++) {
                const monthKey = `${currentYear}-${String(month).padStart(2, '0')}`
                categoryData[categoryId].data.push({ x: monthKey, y: 0 })
            }

            // Populate categoryData with real data
            const incomeMonth = new Date(inc.dateReceived).getMonth() + 1
            const monthKey = `${currentYear}-${String(incomeMonth).padStart(2, '0')}`
            const existingData = categoryData[categoryId].data.find((item) => item.x === monthKey)
            
            if (existingData) {
                existingData.y += inc.amount;
            }
        })

        // Format data for line chart
        const chartData = Object.values(categoryData)
        return { months, chartData }
    }

    const { months, chartData  } = transformData()

    return (
        <div>
            <h2>Income Trend Line Chart</h2>
            <div style={{ height: 400 }}>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    xFormat={(value) => {
                        const date = new Date(value)
                        const options = { year: 'numeric', month: 'short' }
                        return date.toLocaleDateString('default', options)
                    }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        reverse: false
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisLeft={{
                        legend: 'Total Amount',
                        legendOffset: -60,
                        legendPosition: 'middle'
                    }}
                    axisBottom={{
                        tickValues: months,
                        tickRotation: -45
                    }}
                    enablePointLabel={true}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default IncomeLine