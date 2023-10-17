import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import IncomeTable from './IncomeTable'
import SearchIncome from './SearchIncome'
import IncomeFilter from './IncomeFilter'

const Income = () => {

    return (
        <div>
            <IncomeTable />
            <SearchIncome />
        </div>
    )
}

export default Income