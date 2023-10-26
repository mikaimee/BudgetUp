import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteSavingsMutation } from '../../hooks/savingsHook'

import SavingsBar from './SavingsBar'
import AddContribution from './AddContribution'

import { Card, CardContent, TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

const SavingsList = ({ setSelectedSavings, data}) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    // Initialize currentyear based on current date
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    // State to track displayed year
    const [displayedYear, setDisplayedYear] = useState(currentYear)

    const [currentAmount, setCurrentAmount] = useState(0)
    
    // Delete and Update function
    const { mutate: deleteMutate, isLoading: deleteIncLoading } = useDeleteSavingsMutation(queryClient)
    
    // Function to filter savings for selected year
    const filterSavings = (data, year) => {
        return data.filter((sav) => {
            const savingsDate = new Date(sav.createdAt)
            return (
                savingsDate.getFullYear() === year 
            )
        })
    }

    // State variable for sorted savings
    const [sortedSavings, setSortedSavings] = useState([])

    // Function to update filtered and sorted incomes
    const updateFilteredSavings = () => {
        const newFilteredSavings = data && Array.isArray(data)
            ? filterSavings(data, displayedYear)
            : []
        
        // Sort the newFilteredSavings
        const sortedSavings = [...newFilteredSavings].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt))
        
        // Set sortedIncomes using state variable
        setSortedSavings(sortedSavings)
    }

    // Apply filtering based on displayed month and year
    useEffect(() => {
        updateFilteredSavings()
    }, [data, displayedYear])

    // Function to update displayed month and year
    const handleYearChange = (change) => {
        setDisplayedYear(displayedYear + change)
    }

    // Function to handle delete button
    const handleDelete = (savingsId) => {
        // Show confirmation before proceeding with deletion
        const confirmed = window.confirm("Are you sure you want to delete this income?")
        if (confirmed) {
            deleteMutate({ savingsId, token: userState?.userInfo?.token })
        }
    }

    // Function to set text color based on status
    const getStatusTextColor = (status) => {
        switch (status) {
            case 'Complete':
                return 'green';
            case 'Abandoned':
                return 'red';
            case 'On Hold':
                return 'yellow'
            case 'In Progress':
                return 'blue';
            case 'Yet to Start':
                return 'black'
            default:
                return 'inherit'; 
        }
    }

    // Function to calculate savings progress
    const calculateSavingsProgress = (savItem) => {
        if (!savItem) {
            return 0
        }

        const { currentAmount, goalAmount } = savItem

        if (currentAmount >= goalAmount) {
            return 100
        }
        else if (currentAmount <= 0) {
            return 0
        }
        else {
            return (currentAmount / goalAmount) * 100
        }
    }

    return (
        <Container component='main' maxWidth='lg'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    My Savings Goals
                </Typography>
                <div>
                    <Button onClick={() => handleYearChange(-1)}>Previous Year</Button>
                    <span>{`${displayedYear}`}</span>
                    {displayedYear < currentYear && (
                        <Button onClick={() => handleYearChange(1)}>Next Year</Button>
                    )}
                </div>
                {sortedSavings.map((savItem) => (
                    <Card key={savItem._id}>
                        <CardContent>
                            <div>
                                <Typography variant='h10'>Target Date: {new Date(savItem.targetDate).toLocaleDateString()}</Typography>
                                <Typography variant='h10' >Category: {savItem.categoryId.name}</Typography>
                                <Typography variant='h10'>Notes: {savItem.notes}</Typography>
                                <Typography 
                                    variant='h10'
                                    style={{ color: getStatusTextColor(savItem.status) }}
                                >
                                    {savItem.status}
                                </Typography>
                            </div>
                            <SavingsBar 
                                progress={calculateSavingsProgress(savItem)} 
                                currentAmount={savItem.currentAmount} 
                                goalAmount={savItem.goalAmount}
                            />
                            <AddContribution 
                                savingsId={savItem._id}
                                currentAmount={savItem.currentAmount}
                                setCurrentAmount={setCurrentAmount}
                            />
                            <div>
                            <Button onClick={() => setSelectedSavings(savItem)}>Edit</Button>
                            <Button onClick={() => handleDelete(savItem._id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Container>
    )
}

export default SavingsList