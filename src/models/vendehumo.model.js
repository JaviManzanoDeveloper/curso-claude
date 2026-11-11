const CATEGORIAS = ['TECNOLOGIA', 'POLITICA', 'DEPORTES', 'CULTURA', 'FINANZAS', 'SALUD', 'OTROS']

function to_vendehumo(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    foto_url: row.foto_url,
    categoria: row.categoria,
    descripcion: row.descripcion,
    num_votos: row.num_votos,
  }
}

module.exports = { CATEGORIAS, to_vendehumo }
