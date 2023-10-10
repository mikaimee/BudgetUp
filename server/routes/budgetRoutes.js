const express = require('express')
const router = express.Router()
const bController = require('../controller/budgetController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, bController.createBudget)

router.route('/:budgetId')
    .put(protection.authProtect, bController.updateBudget)
    .delete(protection.authProtect, bController.deleteBudget)
    .get(protection.authProtect, bController.getBudgetById)

router.route('/byUser')  //WIP
    .get(protection.authProtect, bController.getAllBudgetsByUser)

router.route('/filter')  // WIP
    .get(protection.authProtect, bController.filterBudgets)

router.route('/:budgetId/addGoal')
    .put(protection.authProtect, bController.addGoalToBudget)

module.exports = router