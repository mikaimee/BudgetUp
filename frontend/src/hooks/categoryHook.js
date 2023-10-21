import { getAllCategory } from '../service/categoryService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useAllCategories() {
    return useQuery(['allCategories'], getAllCategory)
}