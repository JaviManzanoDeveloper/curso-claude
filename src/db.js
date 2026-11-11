const fs = require('node:fs')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')
const { CATEGORIAS } = require('./models/vendehumo.model')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'vendehumos.db')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new DatabaseSync(DB_PATH)

const categorias_sql = CATEGORIAS.map((categoria) => `'${categoria}'`).join(',')

db.exec(`
  CREATE TABLE IF NOT EXISTS vendehumos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    foto_url    TEXT    NOT NULL,
    categoria   TEXT    NOT NULL CHECK (categoria IN (${categorias_sql})),
    descripcion TEXT    NOT NULL,
    num_votos   INTEGER NOT NULL DEFAULT 0
  )
`)

module.exports = db
