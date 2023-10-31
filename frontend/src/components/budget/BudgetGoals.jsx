import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

import GoalTable from './goals/GoalTable'

const BudgetGoals = ({ budgetData }) => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={paperStyle}>
                    <GoalTable budgetData={budgetData} />
                </Paper>
            </Grid>
    </Grid>
    )
}

export default BudgetGoals