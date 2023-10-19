import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '../../hooks/expenseHook'
import { AllCategories } from '../../hooks/categoryHook'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

const CreateExpense = ({ selectedExpense, onEditCancel }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialExpenseData ={
        vendor: '',
        amount: 0,
        method: 'Credit Card',
        dateOfExpense: '',
        isRecurring: false,
        categoryId: '', // Default to an empty string
        token: userState?.userInfo?.token
    }

    const [expenseData, setExpenseData] = useState(initialExpenseData)
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    // state to store selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const {data: categories } = AllCategories()

    // handle edit cancel button
    const handleEditCancel = () => {
        // Clear the selectedExpense from parent component
        onEditCancel()
        // Reset thr form data to its initial state
        setExpenseData(initialExpenseData)
        setIsUpdateMode(false)
    }

    // Effect to update the form when selectedExpense changes
    useEffect(() => {
        if (selectedExpense) {
            setExpenseData(selectedExpense)
            setIsUpdateMode(true)
        }
        else {
            setExpenseData(initialExpenseData)
            setIsUpdateMode(false)
        }
    }, [selectedExpense])

    const { isLoading: createLoading, mutate: createMutate } = useCreateExpenseMutation(queryClient)
    const { isLoading: updateLoading, mutate: updateMutate } = useUpdateExpenseMutation(queryClient, onEditCancel)

    const handleCreateOrUpdateExpense = async () => {
        if (expenseData.categoryId.trim() === '') {
            return
        }

        if (isUpdateMode) {
            try {
                if (!selectedExpense || !selectedExpense._id) {
                    return
                }

                // Format the date to match 'yyyy-MM-dd' before sending request
                const rawDate = new Date(expenseData.dateOfExpense)
                const year = rawDate.getFullYear()
                const month = String(rawDate.getMonth() + 1).padStart(2, '0')
                const day = String(rawDate.getDate()).padStart(2, '0')
                const formattedDate = `${year}-${month}-${day}`
                
                const updatedExpenseData = {
                    ...expenseData, 
                    dateOfExpense: formattedDate,
                    token: userState?.userInfo?.token,
                    _id: selectedExpense._id
                }

                updateMutate({
                    expenseId: selectedExpense._id,
                    updatedExpenseData,
                    token: userState?.userInfo?.token
                })
            }
            catch (error) {
                toast.error(error.message)
                console.error(error)
            }
        }
        else {
            try {
                const result = await createMutate(expenseData)
                console.log("Created Expense: ", result)
                setExpenseData(initialExpenseData)
            }
            catch (error) {
                toast.error(error.message)
                console.error(error)
            }
        }
    }

    return (
        <div>
            <h1>{isUpdateMode ? 'Update Expense' : 'Create Expense'}</h1>
            <div>
                <label>Vendor:</label>
                <input
                    type="text"
                    value={expenseData.vendor}
                    onChange={(e) => setExpenseData({ ...expenseData, vendor: e.target.value })}
                />
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData({ ...expenseData, amount: parseFloat(e.target.value) })}
                />
            </div>
            <div>
                <label>Method:</label>
                <select
                    value={expenseData.method}
                    onChange={(e) => setExpenseData({ ...expenseData, method: e.target.value })}
                >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit Card">Debit Card</option>
                </select>
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={expenseData.dateOfExpense}
                    onChange={(e) => setExpenseData({ ...expenseData, dateOfExpense: e.target.value })}
                />
            </div>
            <div>
                <label>isRecurring:</label>
                <input
                    type="checkbox"
                    checked={expenseData.isRecurring}
                    onChange={(e) => setExpenseData({ ...expenseData, isRecurring: e.target.checked })}
                />
            </div>
            <div>
                <label>Category Id:</label>
                <input
                    type="text"
                    value={expenseData.categoryId}
                    onChange={(e) => setExpenseData({ ...expenseData, categoryId: (e.target.value) })}
                />
            </div>
            {/* Include other input fields for expense data here */}
            <button onClick={handleCreateOrUpdateExpense}>
                {isUpdateMode ? (updateLoading ? 'Updating...' : 'Update Expense') : (createLoading ? 'Creating...' : 'Create Expense')}
            </button>
            {isUpdateMode && <button onClick={handleEditCancel}>Cancel</button>}
        </div>
    )
}

export default CreateExpense