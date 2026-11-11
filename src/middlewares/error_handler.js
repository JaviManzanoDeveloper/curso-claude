// Middleware global de errores: debe registrarse el último y llevar 4 parámetros.
function error_handler(err, req, res, next) {
  if (res.headersSent) return next(err)

  const status = err.status || err.statusCode || 500

  if (status >= 500) console.error(err)

  res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message
  })
}

module.exports = { error_handler }
