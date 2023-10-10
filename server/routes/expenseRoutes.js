const express = require('express')
const router = express.Router()
const eController = require('../controller/expenceController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, eController.createExpense)

router.route('/:expenseId')
    .put(protection.authProtect, eController.updateExpense)
    .delete(protection.authProtect, eController.deleteExpense)

router.route('/byUser')
    .get(protection.authProtect, eController.getAllExpenseByUser)

router.route('/filter')
    .get(protection.authProtect, eController.filterExpenseByDateRange)

router.route('/calculate')
    .get(protection.authProtect, eController.calculateTotalExpenseByDateRange)

router.route('/search')
    .get(protection.authProtect, eController.searchExpense)

router.route('/groupByCategory')
    .get(protection.authProtect, eController.groupExpenseByCategory)

module.exports = router