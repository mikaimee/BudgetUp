import React, { useState, useEffect} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { useAddGoalMutation, useDeleteGoalMutation } from '../../../hooks/budgetHook'

import { Paper, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ClearIcon from '@mui/icons-material/Clear'


// Function to format $
const formatAmount = (amount) => {
    return amount.toFixed(2)
}

const GoalTable = ({ budgetData }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)

    const [isAddFormOpen, setIsAddFormOpen] = useState(false)

    const initialGoalData = {
        description: '',
        targetAmount: 0
    }

    const [goalData, setGoalData] = useState(initialGoalData)
    const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(null)
    const [selectedGoalIndex, setSelectedGoalIndex] = useState(null)

    const { mutate: addGoal } = useAddGoalMutation(queryClient)
    const { mutate: deleteGoal } = useDeleteGoalMutation(queryClient)

    const handleOpenAddForm = (budgetIndex) => {
        setSelectedBudgetIndex(budgetIndex)
        setIsAddFormOpen(true)
    }

    const handleCloseAddForm = () => {
        setIsAddFormOpen(false)
        setSelectedBudgetIndex(null)
        setGoalData(initialGoalData)
    }

    const handleAddGoal = async (e) => {
        e.preventDefault()
        try {
            if (selectedBudgetIndex !== null) {
                const response = await addGoal({
                    budgetId: budgetData[selectedBudgetIndex]._id,
                    goalData,
                    token: userState?.userInfo?.token
                });
                if (response) {
                    handleCloseAddForm();
                    setGoalData(initialGoalData);
                }
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleDeleteGoal = async (budgetIndex, goalIndex) => {
        setSelectedBudgetIndex(budgetIndex)
        setSelectedGoalIndex(goalIndex)

        if (selectedBudgetIndex !== null && selectedGoalIndex !== null) {
            // Perform the deletion based on selectedBudgetIndex and selectedGoalIndex
            try {
                const response = await deleteGoal({
                    budgetId: budgetData[selectedBudgetIndex]._id,
                    goalId: budgetData[selectedBudgetIndex].goals[selectedGoalIndex]._id,
                    token: userState?.userInfo?.token,
                });
                console.log('Delete response:', response);
                if (response) {
                    console.log('Successfully deleted');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div>
            <Typography variant="h6">
                My Goals
            </Typography>
            {budgetData.map((budget, budgetIndex) => (
                <Paper key={budgetIndex} elevation={3} style={{ padding: '16px', marginBottom: '16px', position: 'relative' }}>
                    <Button
                        color="primary"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                        }}
                        startIcon={<AddCircleIcon />}
                        onClick={() => handleOpenAddForm(budgetIndex)}
                    />
                    <Typography variant="h6" gutterBottom>
                        {budget.name}
                    </Typography>
                    {budget.goals.map((goal, goalIndex) => (
                        <Grid container key={goalIndex} alignItems="center" justifyContent="space-between" spacing={2}>
                            <Grid item xs={12} sm={6} container alignItems="center">
                                <StarIcon color="primary" />
                                <Typography variant="subtitle1">
                                    {goal.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} container alignItems="center">
                                <Typography variant="subtitle1" align="right">
                                    ${formatAmount(goal.targetAmount)}
                                </Typography>
                                <Button
                                    color="secondary"
                                    style={{ float: 'right' }}
                                    startIcon={<ClearIcon />}
                                    onClick={() => handleDeleteGoal(budgetIndex, goalIndex)}
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Paper>
            ))}
            <Dialog open={isAddFormOpen} onClose={handleCloseAddForm}>
                <DialogTitle>Add Goal</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter goal details:</DialogContentText>
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        value={goalData.description}
                        onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Amount"
                        variant="outlined"
                        value={goalData.targetAmount}
                        onChange={(e) => setGoalData({ ...goalData, targetAmount: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddForm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddGoal} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default GoalTable