const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const protection = require('../middleware/jwt')

router.post('/login', authController.login)
router.post('/register', authController.registration)

module.exports = router