const express = require('express')
const { create_vendehumo, list_vendehumos } = require('../controllers/vendehumos.controller')

const router = express.Router()

router.get('/', list_vendehumos)
router.post('/', create_vendehumo)

module.exports = router
