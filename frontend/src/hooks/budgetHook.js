import {
    createBudget,
    budgetByUser,
    updateBudget,
    deleteBudget
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
        ({ budgetId, token }) => deleteBudget({ budgetId, token }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('budgetsByUser')
                toast.success("Successfully deleted")
            },
            onError: (error) => {
                toast.error('Error deleting budget', error.message)
                console.error(error)
            }
        }
    )
}