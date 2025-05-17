const express = require('express')
const router = express.Router()
const {
  createTemplate,
  listTemplates,
} = require('../controller/templateController')

// Routes
router.post('/create', createTemplate)
router.get('/list', listTemplates)

module.exports = router
