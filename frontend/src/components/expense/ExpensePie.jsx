import React from 'react'
import { ResponsivePie } from '@nivo/pie'

const ExpensePie = ({ data }) => {

    // Function to transform data for pie chart
    const transformData = (data) => {
        // Create object to store categeory total
        const categoryTotals = {}

        data.forEach((exp) => {
            const categoryId = exp.categoryId._id
            const categoryAmount = exp.amount
            const categoryName = exp.categoryId.name

            // If the category name doesn't exist in the object, initialize it with the amount
            if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = categoryAmount
            }
            else {
                // If the category name exists, add the amount to the existing total
                categoryTotals[categoryName] += categoryAmount
            }
        })

        // Convert object into array of objects
        const pieChartData = Object.keys(categoryTotals).map((categoryName) => ({
            id: `${categoryName}`,
            value: categoryTotals[categoryName],
        }))
    
        return pieChartData
    }

    const pieChartData = transformData(data)

    return (
        <div>
            <div style={{ height: '400px' }}>
                <ResponsivePie
                    data={pieChartData} 
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    startAngle={-8}
                    innerRadius={0.5}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'nivo' }}
                    borderWidth={1}
                    borderColor={{from: 'color', modifiers: [['darker', '0.2']]}}
                    arcLinkLabelsSkipAngle={13}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{from: 'color', modifiers: [['darker', '2']]}}
                    // define patterns and gradients
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(255, 255, 255, 0.3)',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
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

export default ExpensePie