import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '../../hooks/budgetHook'
import { useAllCategories } from '../../hooks/categoryHook'

import { TextField, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, MenuItem, FormControl, InputLabel, Select } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'

const CreateBudget = ({ selectedBudget, onEditCancel}) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialBudgetData = {
        name:'',
        startDate:'',
        endDate: '',
        totalAmount: 0,
        categories:[],
        status: 'Yet to Start',
        goals: [],
        notes: '',
        budgetType: '',
        token: userState?.userInfo?.token
    }

    const [budgetData, setBudgetData] = useState(initialBudgetData)
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    // Handle editCancel button
    const handleEditCancel = () => {
        onEditCancel()
        // Reset the form data to initial state
        setBudgetData(initialBudgetData)
        setIsUpdateMode(false)
    }

    // Effect to update form when selectBudget changes
    useEffect(() => {
        if (selectedBudget) {
            setBudgetData(selectedBudget)
            setIsUpdateMode(true)
        }
        else {
            setBudgetData(initialBudgetData)
            setIsUpdateMode(false)
        }
    }, [selectedBudget])

    // Call hooks
    const { isLoading: createLoading, mutate: createMutate } = useCreateBudgetMutation(queryClient)
    const { isLoading: updateLoading, mutate: updateMutate } = useUpdateBudgetMutation(queryClient, onEditCancel)

    // Function to handle create and update
    const handleCreateOrUpdateBudget = async (e) => {
        e.preventDefault()

        // For updating
        if (isUpdateMode) {
            try {
                if (!selectedBudget || !selectedBudget._id) {
                    return
                }

                const updatedBudgetData = {
                    ...budgetData,
                    token: userState?.userInfo?.token,
                    _id: selectedBudget._id
                    // categories.categoryId: selectedCategoryId
                }

                updateMutate({
                    bugdetId: selectedBudget._id,
                    updatedBudgetData,
                    token: userState?.userInfo?.token
                })

            }
            catch (error) {
                toast.error(error.message)
                console.error(error)
            }
        }
        // Create
        else {
            try {
                const createdBudgetData = {
                    ...budgetData,
                }

                createMutate(createdBudgetData)
                setBudgetData(initialBudgetData)
            }
            catch (error) {
                console.error(error)
                toast.error(error.message)
            }
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    {isUpdateMode ? 'Edit Budget' : 'Add Budget'}
                </Typography>
                <form>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='name'
                        label="Name"
                        name='name'
                        type="text"
                        value={budgetData.name}
                        onChange={(e)=> setBudgetData({ ...budgetData, name: e.target.value })}
                    />
                    <TextField
                        variant='outlined'
                        fullWidth
                        id='startDate'
                        label="Start Date"
                        name='startDate'
                        type="date"
                        value={isUpdateMode ? formatDate(budgetData.startDate) : budgetData.startDate}
                        onChange={(e)=> setBudgetData({ ...budgetData, startDate: e.target.value })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='endDate'
                        label="End Date"
                        name='endDate'
                        type="date"
                        value={isUpdateMode ? formatDate(budgetData.endDate) : budgetData.endDate}
                        onChange={(e)=> setBudgetData({ ...budgetData, endDate: e.target.value })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='totalAmount'
                        label="Total Amount"
                        name='totalAmount'
                        type="number"
                        value={budgetData.totalAmount}
                        onChange={(e)=> setBudgetData({ ...budgetData, totalAmount: parseFloat(e.target.value) })}
                    />
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            required
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={budgetData.status}
                            onChange={(e) => setBudgetData({ ...budgetData, status: e.target.value })
                        }
                        >
                            <MenuItem value="Yet to Start">Yet to Start</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                            <MenuItem value="Abandoned">Abandoned</MenuItem>
                            <MenuItem value="On Hold">On Hold</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel id="status-label">Budget Type</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={budgetData.budgetType}
                            onChange={(e) => setBudgetData({ ...budgetData, budgetType: e.target.value })
                        }
                        >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrUpdateBudget}
                        disabled={isUpdateMode ? updateLoading : createLoading}
                    >
                        {isUpdateMode ? (updateLoading ? 'Updating...' : 'Update Budget') : (createLoading ? 'Adding...' : 'Add Budget')}
                    </Button>
                    {isUpdateMode && (
                        <Box mt={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                onClick={handleEditCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </form>
            </div>
        </Container>
    )
}

export default CreateBudget