import React from 'react'
import { ResponsiveLine  } from '@nivo/line'

const ExpenseLine = ({ data }) => {

    if (!data || data.length === 0) {
        return (
            <div>
                <h2>No expense data available for the current year and month.</h2>
            </div>
        );
    }

    // Get current year and month
    const currentYear = new Date().getFullYear()

    // Data transformation for line chart
    const transformData = () => {
        // Create an array of month keys from January to December
        const months = Array.from({ length: 12 }, (_, i) => {
            return `${currentYear}-${String(i + 1).padStart(2, '0')}`
        })

        // Create object to store data points for each category
        const categoryData = {}

        // Initialize categoryData with all months having zero values
        months.forEach((monthKey) => {
            data.forEach((exp) => {
                const categoryId = exp.categoryId._id;
                const categoryName = exp.categoryId.name;
                if (!categoryData[categoryId]) {
                    categoryData[categoryId] = { id: categoryName, data: [] };
                }
                categoryData[categoryId].data.push({ x: monthKey, y: 0 });
            });
        });

        // Populate categoryData with real data
        data.forEach((exp) => {
            const categoryId = exp.categoryId._id;
            const expenseMonth = new Date(exp.dateOfExpense).getMonth() + 1;
            const monthKey = `${currentYear}-${String(expenseMonth).padStart(2, '0')}`;

            const existingData = categoryData[categoryId].data.find((item) => item.x === monthKey);
            if (existingData) {
                existingData.y += exp.amount;
            }
        });

        // Format data for line chart
        const chartData = Object.values(categoryData);
        return { months, chartData };
    }

    const { months, chartData  } = transformData()

    return (
        <div>
            <h2>Expense Trend Line Chart</h2>
            <div style={{ height: 400 }}>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    xFormat={(value) => {
                        const date = new Date(value);
                        const options = { year: 'numeric', month: 'short' };
                        return date.toLocaleDateString('default', options);
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

export default ExpenseLine