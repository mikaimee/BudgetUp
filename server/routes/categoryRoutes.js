const express = require('express')
const router = express.Router()
const cController = require('../controller/categoryController')

router.route('/')
    .post(cController.createCategory)
    .get(cController.allCategories)

router.route('/:categoryId')
    .put(cController.updateCategory)
    .delete(cController.deleteCategory)

module.exports = router