import axios from 'axios'

export const createSavings = async({
    goalAmount, targetDate, currentAmount, status, contributions, categoryId, notes, token
}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const requestData = { goalAmount, targetDate, currentAmount, status, contributions, categoryId, notes }
        const response  = await axios.post('http://localhost:8000/savings', 
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

export const savingsByUser = async(token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await axios.get('http://localhost:8000/savings/byUser', config)
        if (response.status === 200) {
            return response.data.savingGoals
        }
    }
    catch (err) {
        if (err.response && err.response.data.message) {
            throw new Error(err.response.data.message)
        }
        throw new Error(err.message)
    }
}

export const updateSavings = async ({ savingsId, updatedSavingsData, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.put(`http://localhost:8000/savings/${savingsId}`, updatedSavingsData, config)
        if (response.status === 200) {
            return response.data.savings
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

export const deleteSavings = async ({ savingsId, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.delete(`http://localhost:8000/savings/${savingsId}`, config)
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