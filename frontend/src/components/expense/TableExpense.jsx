import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetExpensesByUser, useDeleteExpenseMutation } from '../../hooks/expenseHook'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TableExpense = ({ setSelectedExpense }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const {
        data,
        isLoading: expenseLoading,
        isError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    const { mutate: deleteMutate, isLoading: deleteExpLoading } = useDeleteExpenseMutation(queryClient)

    if (expenseLoading || deleteExpLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching expenses</div>
    }

    const expenses = data

    // 1. Create copy of 'expenses' array using spread b/c you don't want to modify origial array
    // 2. Use sort method to arrange elements in array
    // 3. Compare two expenses denoted as 'a' an 'b' based on 'dateOfExpense' properties
    // 4. Use 'new Date' constructor to convert into Date objects
    // 5. By subtracting 'new Date(b.dateOfExpense) - new Date(a.dateOfExpense), get a positive value if 'b' date is greater (more recent)
    // 6. Results in 'b' being placed before 'a' in sorted array
    const sortedExpenses = [...expenses].sort((a, b) => 
        new Date(b.dateOfExpense) - new Date(a.dateOfExpense))

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