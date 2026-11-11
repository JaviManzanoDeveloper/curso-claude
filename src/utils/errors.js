class ValidationError extends Error {
  constructor(detalles) {
    super('Datos no válidos')
    this.name = 'ValidationError'
    this.detalles = detalles
  }
}

module.exports = { ValidationError }
