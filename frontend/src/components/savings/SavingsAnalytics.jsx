import React from 'react'

import AverageMonthly from './analytics/AverageMonthly'
import RateOfContribution from './analytics/RateOfContribution'

const SavingsAnalytics = ({ savingsData }) => {

    return (
        <div>
            <AverageMonthly/>
        </div>
    )
}

export default SavingsAnalytics