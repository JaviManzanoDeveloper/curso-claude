const { insert_vendehumo, find_all_vendehumos } = require('../repositories/vendehumos.repository')
const { to_vendehumo } = require('../models/vendehumo.model')
const { validate_vendehumo_input } = require('../utils/validation')
const { ValidationError } = require('../utils/errors')

function create_vendehumo(input = {}) {
  const errores = validate_vendehumo_input(input)
  if (errores.length > 0) throw new ValidationError(errores)

  const row = insert_vendehumo({
    nombre: input.nombre.trim(),
    foto_url: input.foto_url.trim(),
    categoria: input.categoria,
    descripcion: input.descripcion.trim(),
  })

  return to_vendehumo(row)
}

function list_vendehumos() {
  return find_all_vendehumos().map(to_vendehumo)
}

module.exports = { create_vendehumo, list_vendehumos }
