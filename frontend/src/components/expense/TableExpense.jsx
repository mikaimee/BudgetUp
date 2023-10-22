import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetExpensesByUser, useDeleteExpenseMutation } from '../../hooks/expenseHook'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TableExpense = ({ setSelectedExpense, data }) => {

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

    // Apply filtering based on displayed month and year
    const filteredExpenses = data && Array.isArray(data)
        ? filterExpenses(data, displayedYear, displayedMonth)
        : []

    // 1. Create copy of 'expenses' array using spread b/c you don't want to modify origial array
    // 2. Use sort method to arrange elements in array
    // 3. Compare two expenses denoted as 'a' an 'b' based on 'dateOfExpense' properties
    // 4. Use 'new Date' constructor to convert into Date objects
    // 5. By subtracting 'new Date(b.dateOfExpense) - new Date(a.dateOfExpense), get a positive value if 'b' date is greater (more recent)
    // 6. Results in 'b' being placed before 'a' in sorted array
    const sortedExpenses = [...filteredExpenses].sort((a, b) => 
        new Date(b.dateOfExpense) - new Date(a.dateOfExpense))
    

    // Function to update diplayed month and year
    // 1. Use 'setDisplayedMonth' state to update 'displayedMonth'
    // 2. Calculate the new month by adding the 'change' value to previous month
        // a) if change is -1, it means moving to previous month so it subtracts 1 from previous month
        // b) if change is 1, it means moving to next month
    // 3. Check if new month is less than 1, which indicates that you are moving to previous year
        // a) if new month is less than 1 and updating the year, it returns 12 (December)
    // 4. Check if new month is greater than 12, indicating transition to next year
        // a) if new month is greater than 12, it returns 1 after updating year
    // 5. If new month falls within the range of 1 - 12, it returns the new month as it is
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