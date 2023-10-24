import React from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import { Card, CardContent, TextField, Paper, Button, Grid, Checkbox, Typography, Avatar, Link, Container, createTheme, ThemeProvider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

const SavingsBar = ({ progress, currentAmount, goalAmount }) => {

    const formattedPercentage = progress.toFixed(2)

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ flex: 4, paddingRight: '10px', height: '30px', borderRadius: '15px' }}>
                <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: '15px', height: '100%' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body1">
                    ${currentAmount} / ${goalAmount}
                </Typography>
                <Typography variant="caption">
                    {formattedPercentage}% Complete
                </Typography>
            </div>
        </div>
    )
}

export default SavingsBar