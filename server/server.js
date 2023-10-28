require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const path = require('path')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

const mongoose = require('mongoose')
const PORT = 8000
console.log(process.env.NODE_ENV)
require('./config/dbConnection')

// Handle options credentials check before CORS
app.use(credentials)

// CORS
app.use(cors(corsOptions))

// Handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// Static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/incomes', require('./routes/incomeRoutes'))
app.use('/categories', require('./routes/categoryRoutes'))
app.use('/expenses', require('./routes/expenseRoutes'))
app.use('/savings', require('./routes/savingsRoutes'))
app.use('/transactions', require('./routes/transactionRoutes'))
app.use('/budgeting', require('./routes/budgetingRoutes'))

// Custom 404 Error Page 
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({message: '404 not found'})
    }
    else {
        res.type('txt').send('404 not found')
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})