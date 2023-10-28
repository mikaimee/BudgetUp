const express = require('express')
const router = express.Router()
const tController = require('../controller/budgeting')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, tController.createTest)

router.route('/byUser')
    .get(protection.authProtect, tController.getTestByUser)

router.route('/:budgetId')
    .put(protection.authProtect, tController.updateBudgetings)
    .delete(protection.authProtect, tController.deleteBudgetings)

router.route('/:budgetId/addGoals')
    .put(protection.authProtect, tController.addGoalToBudgeting)

router.route('/:budgetId/:goalId')
    .delete(protection.authProtect, tController.deleteGoals)

module.exports = router