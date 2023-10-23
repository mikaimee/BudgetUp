import React from 'react'

import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SaveIcon from '@mui/icons-material/Save'
import PaymentsIcon from '@mui/icons-material/Payments'

const Nav = ({ handleNavItemClick }) => {

    return (
        <List>
            <ListItemButton onClick={() => handleNavItemClick('Dashboard')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavItemClick('Income')}>
                <ListItemIcon>
                    <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Income" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavItemClick('Expense')}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Expense" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavItemClick('Savings')}>
                <ListItemIcon>
                    <SaveIcon />
                </ListItemIcon>
                <ListItemText primary="Savings" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavItemClick('Budget')}>
                <ListItemIcon>
                    <PaymentsIcon />
                </ListItemIcon>
                <ListItemText primary="Budget" />
            </ListItemButton>
        </List>
    )
}

export default Nav