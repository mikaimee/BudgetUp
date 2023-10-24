import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useUpdateSavingsMutation } from '../../hooks/savingsHook'

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

const AddContribution = () => {

    // const queryClient = useQueryClient()
    // const userState = useSelector((state) => state.user)

    // const initialContributionsData = {
    //     amount: 0,
    //     date: ''
    // }

    // const [contributionAmount, setContributionAmount] = useState(0)
    // const [contributionDate, setContributionDate] = useState('')
    // const [contributionData, setContributionData] = useState(initialContributionsData)
    // const [savingsData, setSavingsData] = useState(savingItem)

    // console.log("ADDCONTRI: ", savingsData)

    // // Call hooks
    // const { isLoading: updateLoading, mutate: updateMutate } = useUpdateSavingsMutation(queryClient, onEditCancel)

    // const updateContributions = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const newContribution = {
    //             amount: contributionAmount,
    //             date: contributionDate
    //         }

    //         const updatedContributions = [...savingsData.contributions, newContribution]

    //         const updatedSavingsData = {
    //             ...savingsData,
    //             currentAmount: savingsData.currentAmount + contributionAmount,
    //             token: userState?.userInfo?.token,
    //             contributions: updatedContributions
    //         }

    //         updateMutate({
    //             savingsId: savingsData._id,
    //             updatedSavingsData,
    //             token: userState?.userInfo?.token
    //         })

    //         // Reset contributionsData state to initial value
    //         setContributionData(initialContributionsData)
    //     }
    //     catch (error) {
    //         toast.error(error.message)
    //         console.error(error)
    //     }
    // }

    // const handleCancelContribution = () => {
    //     setContributionAmount(initialContributionsData.amount)
    //     setContributionDate(initialContributionsData.date)
    // }

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography component="h5" variant="h5">
                    Add Contribution
                </Typography>
                {/* <form onSubmit={updateContributions}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="number"
                                label="Contribution Amount"
                                name="contributionAmount"
                                value={contributionAmount}
                                onChange={(e) => setContributionAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="date"
                                label="Contribution Date"
                                name="contributionDate"
                                value={contributionDate}
                                onChange={(e) => setContributionDate(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Add Contribution
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleCancelContribution}
                    >
                        Cancel
                    </Button>
                </form> */}
            </div>
        </Container>
    )
}

export default AddContribution