import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteBudgetMutation } from '../../hooks/budgetHook'

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

// Function for format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
// Function to format $
const formatAmount = (amount) => {
    return amount.toFixed(2)
}

const BudgetTable = ({ data, setSelectedBudget }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    // Delete function
    const { mutate: deleteMutate } = useDeleteBudgetMutation(queryClient)

    data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))

    // Function to handle delete button
    const handleDelete = (budgetId) => {
        console.log('Attempting to delete budget with ID:', budgetId)
        // Show confirmation
        const confirmed = window.confirm("Are you sure you want to delete this budget? ")
        if (confirmed) {
            console.log('Deletion confirmed for budget with ID:', budgetId)
            deleteMutate({ budgetId, token: userState?.userInfo?.token })
        }
    }

    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Budget Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Category and Allocated Amount</TableCell>
                    <TableCell>Remaining Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Budget Type</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((budget, index) => (
                    <TableRow key={index}>
                        <TableCell>{budget.name}</TableCell>
                        <TableCell>{formatDate(budget.startDate)|| 'N/A'}</TableCell>
                        <TableCell>{formatDate(budget.endDate)|| 'N/A'}</TableCell>
                        <TableCell>${formatAmount(budget.totalAmount)|| 'N/A'}</TableCell>
                        {budget.categories.map((category, catIndex) => (
                            <TableCell key={catIndex}>
                                {category.categoryId.name|| 'N/A'} - ${formatAmount(category.allocatedAmount|| 'N/A')}
                            </TableCell>
                        ))}
                        <TableCell>${budget.remainingAmount|| 'N/A'}</TableCell>
                        <TableCell>{budget.status|| 'N/A'}</TableCell>
                        <TableCell>{budget.bugetType|| 'N/A'}</TableCell>
                        <TableCell>{budget.notes|| 'No notes'}</TableCell>
                        <TableCell>
                            <Button onClick={() => setSelectedBudget(budget)}>
                                Edit
                            </Button>
                            <Button onClick={() => handleDelete(budget._id)} >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

export default BudgetTable