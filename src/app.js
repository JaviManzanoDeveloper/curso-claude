const express = require('express')
const vendehumos_routes = require('./routes/vendehumos.routes')
const { error_handler } = require('./middlewares/error_handler')

function create_app() {
  const app = express()

  app.use(express.json())

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/vendehumos', vendehumos_routes)

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
  })

  app.use(error_handler)

  return app
}

module.exports = { create_app }
