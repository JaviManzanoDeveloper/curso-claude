const db = require('../db')

function insert_vendehumo({ nombre, foto_url, categoria, descripcion }) {
  const result = db
    .prepare('INSERT INTO vendehumos (nombre, foto_url, categoria, descripcion) VALUES (?, ?, ?, ?)')
    .run(nombre, foto_url, categoria, descripcion)

  return db
    .prepare('SELECT id, nombre, foto_url, categoria, descripcion, num_votos FROM vendehumos WHERE id = ?')
    .get(result.lastInsertRowid)
}

function find_all_vendehumos() {
  return db
    .prepare('SELECT id, nombre, foto_url, categoria, descripcion, num_votos FROM vendehumos ORDER BY id')
    .all()
}

module.exports = { insert_vendehumo, find_all_vendehumos }
