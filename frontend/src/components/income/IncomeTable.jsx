import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDeleteIncomeMutation } from '../../hooks/incomeHook'
import { useQueryClient } from '@tanstack/react-query'

import { TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

const ITEMS_PER_PAGE = 5

const IncomeTable = ({ setSelectedIncome, data, setFilteredIncomes}) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    // Initialize currentMonth and currentyear based on current date
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Months are 0-indexed
    const currentYear = currentDate.getFullYear()

    // Variable for pagination
    const [currentPage, setCurrentPage] = useState(1)

    // State to track displayed month
    const [displayedMonth, setDisplayedMonth] = useState(currentMonth)
    const [displayedYear, setDisplayedYear] = useState(currentYear)

    // Delete function
    const { mutate: deleteMutate, isLoading: deleteIncLoading } = useDeleteIncomeMutation(queryClient)
    
    // Function to filter incomes for selected month and year
    const filterIncomes = (data, year, month) => {
        return data.filter((inc) => {
            const incomeDate = new Date(inc.dateReceived)
            return (
                incomeDate.getFullYear() === year &&
                incomeDate.getMonth() + 1 === month
            )
        })
    }

    // State variable for sorted incomes
    const [sortedIncomes, setSortedIncomes] = useState([])

    // Function to update filtered and sorted incomes
    const updateFilteredIncomes = () => {
        const newFilteredIncomes = data && Array.isArray(data)
            ? filterIncomes(data, displayedYear, displayedMonth)
            : []
        
        // Sort the newFilteredIncomes
        const sortedIncomes = [...newFilteredIncomes].sort((a, b) => 
            new Date(b.dateReceived) - new Date(a.dateReceived))
        
        // Set sortedIncomes using state variable
        setSortedIncomes(sortedIncomes)
        setFilteredIncomes(sortedIncomes)
    }

    // Apply filtering based on displayed month and year
    useEffect(() => {
        updateFilteredIncomes()
    }, [data, displayedYear, displayedMonth, setFilteredIncomes])

    // Function to update displayed month and year
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

    // Function to handle delete button
    const handleDelete = (incomeId) => {
        // Show confirmation before proceeding with deletion
        const confirmed = window.confirm("Are you sure you want to delete this income?")
        if (confirmed) {
            deleteMutate({ incomeId, token: userState?.userInfo?.token })
        }
    }

    return (
        <Container component='main' maxWidth='lg'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    Income Table
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
                                <TableCell>Source</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedIncomes.map((inc) => (
                                <TableRow key={inc._id}>
                                    <TableCell>{new Date(inc.dateReceived).toLocaleDateString()}</TableCell>
                                    <TableCell>{inc.source}</TableCell>
                                    <TableCell>${inc.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => setSelectedIncome(inc)}>Edit</Button>
                                        <Button onClick={() => handleDelete(inc._id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    )
}

export default IncomeTable