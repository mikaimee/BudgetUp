import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetExpensesByUser, useDeleteExpenseMutation } from '../../hooks/expenseHook'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TableExpense = ({ setSelectedExpense, data, setFilteredExpenses }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    // Initialize currentMonth and currentYear based on current date
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Months are 0-indexed
    const currentYear = currentDate.getFullYear()

    // State to track displayed month
    const [displayedMonth, setDisplayedMonth] = useState(currentMonth)
    const [displayedYear, setDisplayedYear] = useState(currentYear)

    const { mutate: deleteMutate, isLoading: deleteExpLoading } = useDeleteExpenseMutation(queryClient)

    // Functionn to filter expenses for selected month and year
    const filterExpenses = (data, year, month) => {
        return data.filter((exp) => {
            const expenseDate = new Date(exp.dateOfExpense)
            return (
                expenseDate.getFullYear() === year &&
                expenseDate.getMonth() + 1 === month
            )
        })
    }

    // State variable for sorted expenses
    const [sortedExpenses, setSortedExpenses] = useState([])

    // Function to update filtered and sorted expenses
    const updateFilteredExpenses = () => {
        const newFilteredExpenses  = data && Array.isArray(data)
            ? filterExpenses(data, displayedYear, displayedMonth)
            : []
        
        // Sort the newFilteredExpenses
        const sortedExpenses = [...newFilteredExpenses].sort((a, b) => 
            new Date(b.dateOfExpense) - new Date(a.dateOfExpense))
        
        // Set sortedExpenses using the state variable
        setSortedExpenses(sortedExpenses)
        setFilteredExpenses(sortedExpenses)
    }

    // Apply filtering based on displayed month and year
    useEffect(() => {
        updateFilteredExpenses()
    }, [data, displayedYear, displayedMonth, setFilteredExpenses])

    // Function to update diplayed month and year
    const handleMonthChange = (change) => {
        setDisplayedMonth((prevMonth) => {
            const newMonth = prevMonth + change
            if (newMonth < 1) {
                setDisplayedMonth(12)
                setDisplayedYear((prevYear) => prevYear - 1)
            }
            else if (newMonth > 12) {
                setDisplayedMonth(1)
                setDisplayedYear((prevYear) => prevYear + 1)
            }
            else {
                return newMonth
            }
        })
    }

    const handleDelete = (expenseId) => {
        // Show confirmation before proceeding with deletion
        const confirmed = window.confirm("Are you sure you want to delete this expense?")
        if (confirmed) {
            deleteMutate({ expenseId, token: userState?.userInfo?.token })
        }
    }

    return (
        <div>
            <h2>Expense Table</h2>
            <div>
                <button onClick={() => handleMonthChange(-1)}>Previous Month</button>
                <span>{`${displayedMonth}/${displayedYear}`}</span>
                {displayedMonth < currentMonth && (
                    <button onClick={() => handleMonthChange(1)}>Next Month</button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Vendor</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedExpenses.map((exp) => (
                        <tr key={exp._id}>
                            <td>{new Date(exp.dateOfExpense).toLocaleDateString()}</td>
                            <td>{exp.vendor}</td>
                            <td>${exp.amount.toFixed(2)}</td>
                            <td>
                                <button
                                    onClick={() => setSelectedExpense(exp)}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(exp._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableExpense