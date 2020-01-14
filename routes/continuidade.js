const express = require('express')
const continuidadeController = require('../controllers/continuidade')

const router = express.Router()
router.get('/consulta', continuidadeController.index)
router.post('/consulta', continuidadeController.consulta)

module.exports = router