const vendehumos_service = require('../services/vendehumos.service')
const { ValidationError } = require('../utils/errors')

function create_vendehumo(req, res, next) {
  try {
    const vendehumo = vendehumos_service.create_vendehumo(req.body)
    res.status(201).json(vendehumo)
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, detalles: err.detalles })
    }
    next(err)
  }
}

function list_vendehumos(req, res) {
  res.status(200).json(vendehumos_service.list_vendehumos())
}

module.exports = { create_vendehumo, list_vendehumos }
