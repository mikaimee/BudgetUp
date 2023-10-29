import React, { useState, useEffect} from 'react'

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

    data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))

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
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setSelectedBudget(budget)}
                            >
                                Edit
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