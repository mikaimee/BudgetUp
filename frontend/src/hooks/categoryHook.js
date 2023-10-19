import { getAllCategory } from '../service/categoryService'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useCategory() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])

    const fetchAllCategories = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getAllCategory()
            console.log("Category Data: ", data)
            setCategories(data)
            setIsLoading(false)
        }
        catch (err) {
            setError(err)
            setIsLoading(false)
        }
    }

    return {
        error,
        isLoading,
        fetchAllCategories, categories
    }
}

export const AllCategories = () => {
    return useQuery(['allCategories'], getAllCategory, {
        onSuccess: (data) => {
            console.log("All Categories", data)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })
}
