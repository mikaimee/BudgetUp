import axios from 'axios'

export const getAllCategory = async () => {
    try {
        const response = await axios.get('http://localhost:8000/categories')
        if (response.status === 200) {
            return response.data.categories
        }
        throw new Error('Failed to fetch categories')
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw err
    }
}