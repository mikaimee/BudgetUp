const express = require('express')
const router = express.Router()
const iController = require('../controller/incomeController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, iController.createIncome)

router.route('/:incomeId')
    .put(protection.authProtect, iController.updateIncome)
    .delete(protection.authProtect, iController.deleteIncome)

router.route('/byUser')
    .get(protection.authProtect, iController.getAllIncomeByUser)

router.route('/filter')
    .get(protection.authProtect, iController.filterIncomeByDateRange)

router.route('/calculate')
    .get(protection.authProtect, iController.calculateTotalIncomeByDateRange)

router.route('/search')
    .get(protection.authProtect, iController.searchIncome)

router.route('/groupByCategory')
    .get(protection.authProtect, iController.groupIncomeByCategory)

router.route('/byCategory')
    .get(protection.authProtect, iController.filterIncomesByCategory)
    
module.exports = router