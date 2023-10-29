import axios from 'axios'

export const createBudget = async({
    name, startDate, endDate, totalAmount, categories, currency, remainingAmount, status, goals, notes, budgetType, token
}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const requestData = { name, startDate, endDate, totalAmount, categories, currency, remainingAmount, status, goals, notes, budgetType }
        const response  = await axios.post('http://localhost:8000/budgeting', 
            requestData,
            config
        )
        if (response.status === 201) {
            return response.data
        } 
        else {
            throw new Error(`Failed to create an savings. Status: ${response.status}`)
        }
    }
    catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message)
        } 
        else {
            throw error
        }
    }
}

export const budgetByUser = async(token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.get('http://localhost:8000/budgeting/byUser', config)
        if (response.status === 200) {
            return response.data.budgetingsByUser
        }
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

export const updateBudget = async ({ bugdetId, updatedBudgetData, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.put(`http://localhost:8000/budgeting/${bugdetId}`, updatedBudgetData, config)
        if (response.status === 200) {
            return response.data.budget
        }
        else {
            throw new Error(`Update failed with status code: ${response.status}`)
        }
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(`Update failed: ${err.response.data.message}`);
        } 
        else {
            throw new Error(`Update request failed: ${err.message}`);
        }
    }
}

export const deleteBudget = async ({ bugdetId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.delete(`http://localhost:8000/budgeting/${bugdetId}`, config)
        return response.data
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(`Delete failed: ${err.response.data.message}`);
        } 
        else {
            throw new Error(`Delete request failed: ${err.message}`);
        }
    }
}