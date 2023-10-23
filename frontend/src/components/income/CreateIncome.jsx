import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useCreateIncomeMutation, useUpdateIncomeMutation } from '../../hooks/incomeHook'
import { useAllCategories } from '../../hooks/categoryHook'

import { TextField, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, MenuItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box';

const CreateIncome = ({ selectedIncome, onEditCancel }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const initialIncomeData = {
        source: '',
        amount: 0,
        frequency: 'once',
        dateReceived: '',
        isRecurring: false,
        categoryId: '',
        token: userState?.userInfo?.token
    }

    const [incomeData, setIncomeData] = useState(initialIncomeData)
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    // State to store selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useAllCategories()

    // Handle editCancel button
    const handleEditCancel = () => {
        // Clear selectedIncome from parent component
        onEditCancel()
        // Reset the form data to initial state
        setIncomeData(initialIncomeData)
        setIsUpdateMode(false)
        setSelectedCategoryId('')
    }

    // Effect to update form when selectedIncome changes
    useEffect(() => {
        if (selectedIncome) {
            setIncomeData(selectedIncome)
            setSelectedCategoryId(selectedIncome.categoryId)
            setIsUpdateMode(true)
        }
        else {
            setIncomeData(initialIncomeData)
            setSelectedCategoryId('')
            setIsUpdateMode(false)
        }
    }, [selectedIncome])

    // Call hooks
    const { isLoading: createLoading, mutate: createMutate } = useCreateIncomeMutation(queryClient)
    const { isLoading: updateLoading, mutate: updateMutate } = useUpdateIncomeMutation(queryClient, onEditCancel)

    // Function to handle creation and update
    const handleCreateOrUpdateIncome = async (e) => {
        e.preventDefault()
        if (incomeData.categoryId.trim() === ''){
            return
        }

        // For updating
        if (isUpdateMode) {
            try {
                if (!selectedIncome || !selectedIncome._id) {
                    return
                }

                const updatedIncomeData = {
                    ...incomeData,
                    // dateReceived: formattedDate,
                    token: userState?.userInfo?.token,
                    _id: selectedIncome._id,
                    categoryId: selectedCategoryId
                }

                updateMutate({
                    incomeId: selectedIncome._id,
                    updatedIncomeData,
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
                const createdIncomeData = {
                    ...incomeData,
                    categoryId: selectedCategoryId
                }

                const result = await createMutate(createdIncomeData)
                setIncomeData(initialIncomeData)
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
                    {isUpdateMode ? 'Edit Income' : 'Add Income'}
                </Typography>
                <form>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='source'
                        label="Source"
                        name='source'
                        autoComplete='source'
                        autoFocus
                        value={incomeData.source}
                        onChange={(e)=> setIncomeData({ ...incomeData, source: e.target.value })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='amount'
                        label="Amount"
                        name='amount'
                        type="number"
                        value={incomeData.amount}
                        onChange={(e)=> setIncomeData({ ...incomeData, amount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='frequency'
                        label="Frequency"
                        name='frequency'
                        autoComplete='frequency'
                        autoFocus
                        value={incomeData.frequency}
                        onChange={(e)=> setIncomeData({ ...incomeData, frequency: e.target.value })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="date"
                        label="Date"
                        type="date"
                        id="date"
                        value={incomeData.dateReceived}
                        onChange={(e) => setIncomeData({ ...incomeData, dateReceived: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={incomeData.isRecurring}
                                onChange={(e) => setIncomeData({ ...incomeData, isRecurring: e.target.checked })}
                            />
                        }
                        label="Is Recurring"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Category Name"
                        name="categoryId"
                        id="categoryId"
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setIncomeData({ ...incomeData, categoryId: e.target.value });
                        }}
                    >
                        <MenuItem value="">Select a category</MenuItem>
                        {categoriesLoading ? (
                            <MenuItem>Loading categories...</MenuItem>
                        ) : categoriesError ? (
                            <MenuItem>Error loading categories</MenuItem>
                        ) : (
                            categories
                                .filter((category) => category.type === 'income')
                                .map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))
                        )}
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrUpdateIncome}
                        disabled={isUpdateMode ? updateLoading : createLoading}
                    >
                        {isUpdateMode ? (updateLoading ? 'Updating...' : 'Update Income') : (createLoading ? 'Adding...' : 'Add Income')}
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

export default CreateIncome