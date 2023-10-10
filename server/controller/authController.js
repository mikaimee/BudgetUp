const User = require("../model/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errorhandler = require('../middleware/errorHandler')
const errorHandler = require("../middleware/errorHandler")

const SECRET_AT = process.env.ACCESS_TOKEN_SECRET
const SECRET_RT = process.env.REFRESH_TOKEN_SECRET

const registration = async (req, res) => {
    const {firstName, lastName, email, password, dateOfBirth } = req.body

    try {
            if (!firstName || !lastName || !email || !password || !dateOfBirth) {
                return res.status(400).json({ message: 'All fields are required' })
            }

            const dobParts = dateOfBirth.split('/')
            if (dobParts.length !== 3) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const month = parseInt(dobParts[0], 10)
            const day = parseInt(dobParts[1], 10)
            const year = parseInt(dobParts[2], 10)
            if (isNaN(month) || isNaN(day) || isNaN(year)) {
                return res.status(400).json({ message: "Invalid date format" })
            }
            const parsedDateOfBirth = new Date(year, month - 1, day)

            const duplicate = await User.findOne({ email }).collation({locale: 'en', strength: 2}).lean().exec()
            if (duplicate) {
                return res.status(409).json({ message: 'User already exists' })
            }

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password,
                dateOfBirth: parsedDateOfBirth,
            })

            return res.status(201).json({
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                initialAvatar: newUser.initialAvatar,
                selectedAvatar: newUser.selectedAvatar,
                isAdmin: newUser.isAdmin,
                country: newUser.country,
                goals: newUser.goals,
                token: await newUser.getSigninToken(),
                message: `New user ${firstName} created` 
            })
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400).json({message: "All fields are required"})
    }

    try {
        const user = await User.findOne({email: email})
        if (!user) {
            res.status(404).json({message: "Invalid credentials"})
        }

        const validPassword = await user.matchPassword(password)
        if (!validPassword) {
            res.status(404).json({message: "Invalid credentials"})
        }

        const token = await user.getSigninToken()

        return res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            country: user.country,
            goals: user.goals,
            transactionHistory: user.transactionHistory,
            token: token,
            message: `${user.firstName} is logged in!` 
        })
    }
    catch(error) {
        errorHandler(error, res, res)
    }
}

const refreshToken = async (req, res) => {
    const cookies = req.cookies
    // If cookies doesn't exist
    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt
    const loggingUser = await User.findOne({refreshToken}).exec()
    if(!loggingUser) return res.status(403).json({message: 'Forbidden'})

    jwt.verify(
        refreshToken,
        SECRET_RT,
        (err, decoded) => {
            if (err || loggingUser.email !== decoded.email) {
                return res.status(403).json({message: 'Forbidden'})
            }
            const accessToken = jwt.sign(
                {
                    id: loggingUser._id,
                    email: loggingUser.email
                },
                SECRET_AT,
                {expiresIn: '10s'}
            )
            res.json({loggingUser, accessToken})
        }
    )
}

const logout = async (req, res) => {

    const { token } = req.body

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const decodedToken = jwt.verify(token, SECRET_AT)
        await addToTokenBlacklist(decodedToken)
        res.status(200).json({ message: "Logout Successful" })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error "})
    }
}

module.exports = {
    registration,
    login,
    refreshToken,
    logout
}