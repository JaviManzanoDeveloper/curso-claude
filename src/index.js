const { create_app } = require('./app')

const PORT = process.env.PORT || 3000

create_app().listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`)
})
