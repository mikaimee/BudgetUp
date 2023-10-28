import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'

import { Card, CardContent, TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'

import SavingsFilter from './SavingsFilter';

// Historica/ Contributions: display history list of contributions made over time (date, contribution amount)
// Filter by Date and Filter by status
// Visual Analytics: average monthly contribution, the rate of progress, and prjections for acheiving future goals
// COmparions Tool: compare progress of different savings goals over time to gain insigth into financial priorities + acheivements
// Monthly / Yearly summary: summary to show monthly or yearly totals of contributions + progress
const SavingsHistory = ({ data }) => {

    // Function to format date 
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { year: "numeric", month: "2-digit", day: "2-digit" }
        return date.toLocaleDateString(undefined, options)
    }

    return (
        <Container component='main' maxWidth='lg'>
        <CssBaseline />
        <div>
            <Typography component='h2' variant='h5'>
                Savings History
            </Typography>
            {data.map((savingsItem, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant='h6'>Date: {formatDate(savingsItem.createdAt)}</Typography>
                    <Typography variant='body1'>Status: {savingsItem.status}</Typography>
                    <Typography variant='body1'>Category: {savingsItem.categoryId.name}</Typography>
                    <Typography variant='body1'>Goal Amount: {savingsItem.goalAmount.toFixed(2)}</Typography>
                    <div>
                        {savingsItem.contributions.map((contribution, contributionIndex) => (
                            <div key={contributionIndex}>
                                <Typography variant='body1'>{formatDate(contribution.date)}</Typography>
                                <Typography variant='body1'>+ ${contribution.amount.toFixed(2)}</Typography>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </Container>
    )
}

export default SavingsHistory