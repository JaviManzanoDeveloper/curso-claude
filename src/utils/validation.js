const { CATEGORIAS } = require('../models/vendehumo.model')

function validate_vendehumo_input({ nombre, foto_url, categoria, descripcion } = {}) {
  const errores = []

  if (typeof nombre !== 'string' || nombre.trim() === '') errores.push('nombre es obligatorio')
  if (typeof foto_url !== 'string' || foto_url.trim() === '') errores.push('foto_url es obligatoria')
  if (!CATEGORIAS.includes(categoria)) errores.push(`categoria debe ser una de: ${CATEGORIAS.join(', ')}`)
  if (typeof descripcion !== 'string' || descripcion.trim() === '') errores.push('descripcion es obligatoria')

  return errores
}

module.exports = { validate_vendehumo_input }
