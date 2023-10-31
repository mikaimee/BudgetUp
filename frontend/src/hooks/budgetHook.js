import {
    createBudget,
    budgetByUser,
    updateBudget,
    deleteBudget,
    addGoalsToBudget,
    updateGoal,
    deleteGoal
} from '../service/budgetService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useCreateBudgetMutation = (queryClient) => {
    return useMutation(
        (budgetData) => createBudget(budgetData),
        {
            onSuccess: async (data) => {
            // Handle the success case
            console.log(data)
            queryClient.invalidateQueries('budgetsByUser')
            toast.success('Budget created successfully')
            },
            onError: (error) => {
            // Handle the error case
            toast.error(error.message)
            console.error(error)
            }
        }
    )
}

export const useGetBudgetByUser = (token) => {
    return useQuery(['budgetsByUser'], () => budgetByUser(token), {
        onSuccess: (data) => {
            // console.log('Expenses by user: ', data)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })
}

export const useUpdateBudgetMutation = (queryClient, onEditCancel) => {
    return useMutation(
        ({ bugdetId, updatedBudgetData, token }) => {
            return updateBudget({ bugdetId, updatedBudgetData, token })
        },
        {
            onSuccess: (data) => {
                if (data) {
                    queryClient.invalidateQueries('budgetsByUser')
                    console.log('Updated Budget: ', data)
                    toast.success('Budget updated successfully')
                    onEditCancel()
                }
                else {
                    toast.error('Failed to update budget')
                }
            },
            onError: (error) => {
                toast.error('Error updating budget', error.message)
                console.error(error)
            }
        }
    )
}

export const useDeleteBudgetMutation = (queryClient) => {
    return useMutation(
        ({ budgetId, token }) => {
            console.log('Deleting budget with ID:', budgetId);
            return deleteBudget({ budgetId, token });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('budgetsByUser')
                toast.success("Successfully deleted")
            },
            onError: (error) => {
                toast.error('Error deleting budget', error.message)
                console.error(error)
            },
            
            onSettled: (data, error, variables) => {
                console.log("Mutation completed with data:", data);
                console.error("Mutation completed with error:", error);
                console.log("Mutation variables:", variables);
            }
        }
    )
}

export const useAddGoalMutation = (queryClient) => {
    return useMutation(
        ({ budgetId, goalData, token }) => {
            const parsedAmount = parseFloat(goalData.targetAmount)
            if (isNaN(parsedAmount)) {
                throw new Error('Invalid amount');
            }
            goalData.targetAmount = parsedAmount
            return addGoalsToBudget({ budgetId, goalData, token })
        },
        {
            onSuccess: (data) => {
                if (data) {
                    queryClient.invalidateQueries('budgetsByUser')
                    console.log('Updated Budget: '. data)
                    toast.success('Added Goal successfully')
                }
                else {
                    toast.error('Failed to add goal')
                }
            },
            onError: (error) => {
                toast.error('Error adding goal', error.message)
                console.error(error)
            }
        }
    )
}

export const useDeleteGoalMutation = (queryClient) => {
    return useMutation(
        ({ budgetId, goalId, token }) => deleteGoal({ budgetId, goalId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('budgetsByUser')
                toast.success("Successfully deleted goal")
            },
            onError: (error) => {
                toast.error('Error deleting goal', error.message)
                console.error(error)
            }
        }
    )
}