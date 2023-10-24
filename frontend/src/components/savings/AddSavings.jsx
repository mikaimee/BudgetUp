import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useCreateSavingsMutation, useUpdateSavingsMutation } from '../../hooks/savingsHook'
import { useAllCategories } from '../../hooks/categoryHook'

import { TextField, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, MenuItem, FormControl, InputLabel, Select } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'

const AddSavings = ({ selectedSavings, onEditCancel }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialSavingsData = {
        goalAmount: 0,
        targetDate: '',
        status: 'Yet to Start',
        contributions: [],
        categoryId: '',
        notes: '',
        token: userState?.userInfo?.token
    }

    const [savingsData, setSavingsData] = useState(initialSavingsData)
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    // State to store selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useAllCategories()

    // Handle editCancel button
    const handleEditCancel = () => {
        onEditCancel()
        // Reset the form data to initial state
        setSavingsData(initialSavingsData)
        setIsUpdateMode(false)
        setSelectedCategoryId('')
    }

    // Effect to update form when selectSavings changes
    useEffect(() => {
        if (selectedSavings) {
            setSavingsData(selectedSavings)
            setSelectedCategoryId(selectedSavings.categoryId)
            setIsUpdateMode(true)
        }
        else {
            setSavingsData(initialSavingsData)
            setSelectedCategoryId('')
            setIsUpdateMode(false)
        }
    }, [selectedSavings])

    // Call hooks
    const { isLoading: createLoading, mutate: createMutate } = useCreateSavingsMutation(queryClient)
    const { isLoading: updateLoading, mutate: updateMutate } = useUpdateSavingsMutation(queryClient, onEditCancel)

    // Function to handle create and update
    const handleCreateOrUpdateSavings = async (e) => {
        e.preventDefault()
        if (savingsData.categoryId.trim() === '') {
            return
        }

        // For updating
        if (isUpdateMode) {
            try {
                if (!selectedSavings || !selectedSavings._id) {
                    return
                }

                const updatedSavingsData = {
                    ...savingsData,
                    token: userState?.userInfo?.token,
                    _id: selectedSavings._id,
                    categoryId: selectedCategoryId
                }

                updateMutate({
                    savingsId: selectedSavings._id,
                    updatedSavingsData,
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
                if (!selectedCategoryId) {
                    toast.error('Please select a category')
                    return
                }

                const createdSavingsData = {
                    ...savingsData,
                    categoryId: selectedCategoryId
                }

                const result = await createMutate(createdSavingsData)
                setSavingsData(initialSavingsData)
            }
            catch (error) {
                console.error(error)
                toast.error(error.message)
            }
        }
    }


    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div>
                <Typography component='h2' variant='h5'>
                    {isUpdateMode ? 'Edit Savings' : 'Add Savings'}
                </Typography>
                <form>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='goalAmount'
                        label="goalAmount"
                        name='goalAmount'
                        type="number"
                        value={savingsData.goalAmount}
                        onChange={(e)=> setSavingsData({ ...savingsData, goalAmount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='currentAmount'
                        label="Current Amount (optional)"
                        name='currentAmount'
                        type="currentAmount"
                        value={savingsData.currentAmount}
                        onChange={(e)=> setSavingsData({ ...savingsData, currentAmount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        required
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='targetDate'
                        label='Target Date'
                        name='targetDate'
                        type='date'
                        value={savingsData.targetDate}
                        onChange={(e)=> setSavingsData({ ...savingsData, targetDate: e.target.value })}
                    />
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            required
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={savingsData.status}
                            onChange={(e) => setSavingsData({ ...savingsData, status: e.target.value })
                        }
                        >
                            <MenuItem value="Yet to Start">Yet to Start</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                            <MenuItem value="Abandoned">Abandoned</MenuItem>
                            <MenuItem value="On Hold">On Hold</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant='outlined' fullWidth margin='normal'>
                        <InputLabel id='category-label'>Category Name</InputLabel>
                        <Select
                            required
                            labelId='category-label'
                            id='categoryId'
                            name='categoryId'
                            value={selectedCategoryId}
                            onChange={(e) => {
                                setSelectedCategoryId(e.target.value);
                                setSavingsData({ ...savingsData, categoryId: e.target.value });
                            }}
                        >
                            <MenuItem value=''>Select a category</MenuItem>
                            {categoriesLoading ? (
                                <MenuItem>Loading categories...</MenuItem>
                            ) : categoriesError ? (
                                <MenuItem>Error loading categories</MenuItem>
                            ) : (
                                categories
                                .filter((category) => category.type === 'savings')
                                .map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='notes'
                        label='Notes (optional)'
                        name='notes'
                        multiline
                        rows={4} 
                        value={savingsData.notes}
                        onChange={(e) =>
                        setSavingsData({ ...savingsData, notes: e.target.value })
                        }
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrUpdateSavings}
                        disabled={isUpdateMode ? updateLoading : createLoading}
                    >
                        {isUpdateMode ? (updateLoading ? 'Updating...' : 'Update Savings') : (createLoading ? 'Adding...' : 'Add Savings')}
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

export default AddSavings