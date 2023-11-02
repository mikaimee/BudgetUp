import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useGetIncomesByUser } from '../../hooks/incomeHook'
import { useGetExpensesByUser } from '../../hooks/expenseHook'
import { useGetSavingsByUser } from '../../hooks/savingsHook'
import { useGetBudgetByUser } from '../../hooks/budgetHook'

import IncExpBar from '../../components/dashboard/IncExpBar'
import TotalIncome from '../../components/dashboard/TotalIncome'
import TotalExpense from '../../components/dashboard/TotalExpense'
import YearlyExpensePie from '../../components/expense/YearlyExpensePie'
import BarGraph from '../../components/budget/BarGraph'
import SavingsList from '../../components/savings/SavingsList'

import { Box, CssBaseline, Container, Paper, Grid, Typography, Link, Divider, Toolbar } from '@mui/material'

const DashboardPage = () => {

    const paperStyle = {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '240px'
    }

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [selectedSavings, setSelectedSavings] = useState(null)

    const {
        data: incomeData,
        isLoading: incomeLoading,
        isError: incomeError
    } = useGetIncomesByUser(userState?.userInfo?.token)
    
    const {
        data: expenseData,
        isLoading: expenseLoading,
        isError: expenseError
    } = useGetExpensesByUser(userState?.userInfo?.token)

    const {
        data: savingsData,
        isLoading: savingsLoading,
        isError: savingsError
    } = useGetSavingsByUser(userState?.userInfo?.token)

    const {
        data: budgetData,
        isLoading: budgetLoading,
        isError: budgetError
    } = useGetBudgetByUser(userState?.userInfo?.token)

    if (incomeLoading || expenseLoading || savingsLoading || budgetLoading) {
        return <div>Loading...</div>
    }

    if (incomeError || expenseError || savingsError || budgetError) {
        return <div>Error fetching data</div>
    }

    const currentYear = new Date().getFullYear()


    return (
        <Grid container spacing={3}>
            <Typography variant="h4" align="center" style={{ marginTop: '20px' }}>
                Welcome {userState.userInfo.firstName}!  
                Take a look at your financial summary for {currentYear}
            </Typography>
            <Grid item xs={12} md={11.5}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '50%', height: '100%', marginRight: '10px' }}>
                        <Paper sx={paperStyle}>
                            <IncExpBar incomeData={incomeData} expenseData={expenseData} />
                        </Paper>
                    </div>
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Paper sx={paperStyle} style={{marginBottom: '10px'}}>
                            <TotalIncome incomeData={incomeData} />
                        </Paper>
                        <Paper sx={paperStyle}>
                            <TotalExpense expenseData={expenseData} />
                        </Paper>
                    </div>
                </div>
            </Grid>
            <Grid item xs={10} md={11.5}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Paper sx={paperStyle} style={{width: '50%', marginRight: '10px'}}>
                        <YearlyExpensePie data={expenseData} />
                    </Paper>
                    <Paper sx={paperStyle} style={{width: '50%'}}>
                        <BarGraph budgetData={budgetData} />
                    </Paper>
                </div>
                
            </Grid>
            <Grid item xs={10} md={11.5}>
                <Paper sx={paperStyle}>
                    <SavingsList setSelectedSavings={setSelectedSavings} data={savingsData} />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default DashboardPage