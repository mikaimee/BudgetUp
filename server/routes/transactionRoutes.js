const express = require('express')
const router = express.Router()
const tController = require('../controller/transactionController')
const protection = require('../middleware/jwt')

router.route('/')
    .get(protection.authProtect, tController.getAllTransactions)

router.route('/byType')
    .get(protection.authProtect, tController.filterTransactionsByType)

router.route('/byDate')
    .get(protection.authProtect, tController.filterTransactionsByDateRange)


module.exports = router