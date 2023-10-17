import { getAllCategory } from '../service/categoryService'
import { useState } from 'react'

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
        fetchAllCategories, categories,
    }
}