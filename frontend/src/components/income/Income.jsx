import React, { useState } from 'react'
import IncomeTable from './IncomeTable'
import SearchIncome from './SearchIncome'
import CreateIncome from './CreateIncome'

const Income = () => {

    return (
        <div>
            <IncomeTable />
            <SearchIncome />
            <CreateIncome />
        </div>
    )
}

export default Income