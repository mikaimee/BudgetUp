import React, { useState, useEffect } from 'react'
import { useCategory } from '../../hooks/categoryHook'

const IncomeFilter = ({ onFilter }) => {

    const [categoryId, setCategoryId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { categories, fetchAllCategories, isLoading } = useCategory()
    const [filteredCategories, setFilteredCategories] = useState([])
    const selectedType = 'income'

    useEffect(() => {
        fetchAllCategories()
    },[])

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.type === selectedType))
    }, [selectedType, categories])

    const handleFilterClick = () => {
        onFilter({categoryId, startDate, endDate})
    }

    return (
        <div>
            <h2>Income Filter</h2>
            <div>
                <label>Filter by Category:</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select a Category</option>
                    {filteredCategories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
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