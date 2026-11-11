# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install dependencies: `npm install`
- Start the server: `npm start` (runs `node src/index.js`, port from `PORT`, default 3000)
- Start with auto-restart on changes: `npm run dev` (uses `node --watch`)
- Tests: none yet. `npm test` is the placeholder from `npm init` and exits with an error. There is no lint script and no test runner configured.

## Herramientas

- Usa prettier para quitar los ";" innecesarios del código. Y utiliza ' antes que las ".
- Utiliza el linter eslint.
- Los tests los vamos a hacer con vitest.

## Convenciones

- Las funciones las vamos a poner en snake_case.

## Architecture

Small Express 5 API (CommonJS, Node built-in `node:sqlite`, no ORM).

Layered structure, requests flow top to bottom:

- `src/index.js` only calls `listen`. `src/app.js` (`create_app`) wires JSON parsing, `GET /health`, the `/vendehumos` routes and the 404 handler.
- `src/routes/` maps paths to controllers.
- `src/controllers/` translates HTTP to service calls and maps `ValidationError` to 400. Other errors go to `next`.
- `src/services/` holds the business logic: validates input (via `utils/validation.js`), trims strings, calls repositories and returns model objects.
- `src/repositories/` is the only layer that runs SQL, through the shared `db` from `src/db.js`.
- `src/models/` holds the `CATEGORIAS` enum and `to_vendehumo`, which maps a DB row to the API shape.
- `src/utils/` holds pure helpers: input validation and `ValidationError`.
- `src/db.js` opens the SQLite database and creates the `vendehumos` table on load (`CREATE TABLE IF NOT EXISTS`, so there is no migration system). The file is `data/vendehumos.db` unless `DB_PATH` is set. The `CHECK` constraint is built from `CATEGORIAS`, so the category list lives only in `src/models/vendehumo.model.js`.

`CREATE TABLE IF NOT EXISTS` does not alter an existing table. Changing the schema requires migrating or deleting `data/vendehumos.db`.

The vote counter is `num_votos` in both the table and the API responses. New vendehumos always start at 0; the create endpoint does not accept it.
