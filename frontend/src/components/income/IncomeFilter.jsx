import React, { useState, useEffect } from 'react'
import { useCategory } from '../../hooks/categoryHook'
import { useIncome } from '../../hooks/incomeHook'

const IncomeFilter = ({ onFilter }) => {

    const [categoryId, setCategoryId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleFilterClick = () => {
        onFilter({ categoryId, startDate, endDate })
    }

    return (
        <div>
            <h2>Income Filter</h2>
            <div>
                <label>Filter by Date Range:</label>
                <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button onClick={handleFilterClick}>Filter</button>
        </div>
    )
}

export default IncomeFilter