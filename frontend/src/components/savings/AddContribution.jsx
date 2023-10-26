import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useAddContributionMutation } from '../../hooks/savingsHook'

import {
    Container,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Box,
} from '@mui/material'

const AddContribution = ({ savingsId, currentAmount, setCurrentAmount }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialContributionData = {
        amount: 0,
        date: ''
    }

    const [contributionData, setContributionData] = useState(initialContributionData)

    const { mutate: addContribution } = useAddContributionMutation(queryClient)

    const handleAddContribution = async (e) => {
        e.preventDefault()
        try {
            // call mutation
            const response = addContribution({
                savingsId,
                contributionData,
                token: userState?.userInfo?.token
            })
            
            if(response) {
                // Update currentAmount by adding new contribution
                const contributionAmount = parseFloat(contributionData.amount)
                const newCurrentAmount = currentAmount + contributionAmount
                setCurrentAmount(newCurrentAmount)

                // Reset contribution form field
                setContributionData(initialContributionData)
            }
        }
        catch (error) {
            toast.error('Failed to add contribution', error.message)
            console.error(error)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography component="h5" variant="h5">
                    Add Contribution
                </Typography>
                <form onSubmit={handleAddContribution}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                type='number'
                                label='Contribution Amount'
                                name='amount'
                                value={contributionData.amount}
                                onChange={(e) => setContributionData({...contributionData, amount: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                type='date'
                                label='Contribution Date'
                                name='date'
                                value={contributionData.date}
                                onChange={(e) => setContributionData({...contributionData, date: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                    <Button type='submit' variant='container' color='primary'>
                        Add Contribution
                    </Button>
                </form>
            </div>
        </Container>
    )
}

export default AddContribution