import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createIncome } from '../../service/incomeService'
import { useCategory } from '../../hooks/categoryHook'

const CreateIncome = () => {

    const userState = useSelector((state) => state.user)
    const { isLoading, error, fetchAllCategories, categories } = useCategory

    const [incomeData, setIncomeData] = useState({
        source: '',
        amount: 0,
        frequency: '',
        dateReceived: '',
        isRecurring: false,
        categoryId: '',
    })

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setIncomeData({
            ...incomeData,
            [name]: type === 'checkbox' ? checked: value
        })
    }

    const handleCategoryChange = (e) => {
        setIncomeData({
            ...incomeData,
            categoryId: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { source, amount, frequency, dateReceived, isRecurring, categoryId } = incomeData
            const token = userState?.userInfo?.token
            
            // Use the createIncome service directly
            const newIncome = await createIncome({
                source,
                amount,
                frequency,
                dateReceived, // Date field should be a string (e.g., '2023-10-17')
                isRecurring,
                categoryId,
                token
            })
            window.location.reload()
            console.log('New Income created:', newIncome)
        }
        catch (error) {
            console.error('Error creating income:', error)
        }
    }

    return (
        <div>
            <h2>Create Income</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="source"
                    value={incomeData.source}
                    onChange={handleInputChange}
                    placeholder="Source"
                />
                <input
                    type="number"
                    name="amount"
                    value={incomeData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                />
                <input
                    type="text"
                    name="frequency"
                    value={incomeData.frequency}
                    onChange={handleInputChange}
                    placeholder="Frequency"
                />
                <input
                    type="date" // Use type 'date' for date input
                    name="dateReceived"
                    value={incomeData.dateReceived}
                    onChange={handleInputChange}
                />
                <label>
                    Recurring:
                    <input
                        type="checkbox"
                        name="isRecurring"
                        checked={incomeData.isRecurring}
                        onChange={handleInputChange}
                    />
                </label>
                    <label>Category:</label>
                <button type="submit">Create Income</button>
            </form>
        </div>
    )
}

export default CreateIncome