import React, {useState} from 'react'
import Income from '../../components/income/Income'
import Expense from '../../components/expense/Expense'

import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'

const IncExpPage = () => {

    // Set active component
    const [activeComponent, setActiveComponent] = useState('income')
    const handleSliderChange = (e, newValue) => {
        setActiveComponent(newValue === 0 ? 'income' : 'expense')
    }
    return (
        <div>
            <Slider
                value={activeComponent === 'income' ? 0 : 1}
                min={0}
                max={1}
                step={1}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
            />
            <Typography variant="h6" gutterBottom>
                {activeComponent === 'income' ? 'Income' : 'Expense'}
            </Typography>
            {activeComponent === 'income' ? <Income /> : <Expense />}
        </div>
    )
}

export default IncExpPage