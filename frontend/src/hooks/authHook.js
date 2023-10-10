import { useState } from "react";
import { useDispatch } from 'react-redux'
import { userActions } from '../store/userReducer'
import { signin, signup } from "../service/authService"

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const login = async (email, password) => {
        setIsLoading(true)

        try {
            const data = await signin({ email, password })
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem('account', JSON.stringify(data))
            setIsLoading(false)
            return data
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from signin:', error)
            throw error
        }
    }

    const registerUser = async ({ firstName, lastName, email, password, dateOfBirth }) => {
        setIsLoading(true)
        try {
            const data = await signup({ firstName, lastName, email, password, dateOfBirth })
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem('account', JSON.stringify(data))
            setIsLoading(false)
            return data
        }
        catch (error) {
            setIsLoading(false)
            console.error('Error from signup:', error)
            throw error
        }
    }

    return { login, registerUser, isLoading}
}