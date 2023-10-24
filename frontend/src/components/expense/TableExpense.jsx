import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDeleteExpenseMutation } from '../../hooks/expenseHook'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

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

    // Function to filter expenses for selected month and year
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

    // State to track number if items to display and total number of items
    const [displayedItems, setDisplayedItems] = useState(5)
    const totalItems = sortedExpenses.length

    // Slice sortedExpenses array to display only desired # of items
    const displayedExpenses = sortedExpenses.slice(0, displayedItems)

    // Load more and Show less buttons
    const handleLoadMore = () => {
        // Increase number of displayed items
        setDisplayedItems(displayedItems + 5)
    }

    const handleShowLess = () => {
        // Decrease the number of displayed items to the initial value (5)
        setDisplayedItems(5)
    }

    return (
        <Container component='main' maxWidth='lg'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    Expense Table
                </Typography>
                <div>
                    <Button onClick={() => handleMonthChange(-1)}>Previous Month</Button>
                    <span>{`${displayedMonth}/${displayedYear}`}</span>
                    {displayedMonth < currentMonth && (
                        <Button onClick={() => handleMonthChange(1)}>Next Month</Button>
                    )}
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedExpenses.map((exp) => (
                                <TableRow key={exp._id}>
                                    <TableCell>{new Date(exp.dateOfExpense).toLocaleDateString()}</TableCell>
                                    <TableCell>{exp.vendor}</TableCell>
                                    <TableCell>${exp.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setSelectedExpense(exp)}>Edit</Button>
                                        <Button onClick={() => handleDelete(exp._id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                {displayedItems < totalItems && (
                    <Button onClick={handleLoadMore}>Load More</Button>
                )}
                {displayedItems > 5 && (
                    <Button onClick={handleShowLess}>Show Less</Button>
                )}
            </div>
        </Container>
    )
}

export default TableExpense