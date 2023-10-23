import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGetExpensesByUser, useDeleteExpenseMutation } from '../../hooks/expenseHook'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

const ITEMS_PER_PAGE = 5

const TableExpense = ({ setSelectedExpense, data, setFilteredExpenses }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    // Initialize currentMonth and currentYear based on current date
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Months are 0-indexed
    const currentYear = currentDate.getFullYear()

    // Variable for pagination
    const [currentPage, setCurrentPage] = useState(1)

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

    // Calculate range of items to diaplay based on current
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    // Function to get items to display based on current page
    const getItemsToDisplay = () => sortedExpenses.slice(startIndex, endIndex)

    // Update filtered expenses when crrent page change
    useEffect(() => {
        const itemsToDisplay = getItemsToDisplay()
        setFilteredExpenses(itemsToDisplay)
    }, [currentPage, sortedExpenses, setFilteredExpenses])

    // Function to handle load more
    const handleLoadMore = () => {
        if (endIndex < sortedExpenses.length) {
            setCurrentPage((prevPage) => prevPage + 1)
        }
    }

    // Function to handle show less
    const handleShowLess  = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1)
        }
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
                        {sortedExpenses.map((exp) => (
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
                <div>
                    {sortedExpenses.length > ITEMS_PER_PAGE && (
                        <div>
                            {currentPage > 1 && <Button onClick={handleShowLess}>Show Less</Button>}
                            {endIndex < sortedExpenses.length && <Button onClick={handleLoadMore}>Load More</Button>}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default TableExpense