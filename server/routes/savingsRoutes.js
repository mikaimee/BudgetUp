const express = require('express')
const router = express.Router()
const sController = require('../controller/savingsController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, sController.createSavings)

router.route('/:savingsId')
    .put(protection.authProtect, sController.updateSavings)
    .delete(protection.authProtect, sController.deleteSavings)

router.route('/byUser')
    .get(protection.authProtect, sController.listSavingGoalByUser)

router.route('/groupByCategory')
    .get(protection.authProtect, sController.groupSavingsByCategory)

router.route('/:savingsId/contribution')
    .put(protection.authProtect, sController.addContributions)

router.route('/:savingsId/:contributionId')
    .delete(protection.authProtect, sController.deleteContribution)

module.exports = router