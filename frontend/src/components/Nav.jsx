import React from 'react'
import { useNavigate } from 'react-router-dom'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const Nav = () => {

    const navigate = useNavigate()

    const navigateToDashboard = () => {
        navigate('/dashboard')
    }

    const navigateToExpense = () => {
        navigate('/expense')
    }

    return (
        <List>
            <ListItemButton onClick={navigateToDashboard}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={navigateToExpense}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Expense" />
            </ListItemButton>
        </List>
    )
}

export default Nav