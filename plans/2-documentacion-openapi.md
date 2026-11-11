# 2 - Documentación OpenAPI de la API

- **Tipo:** feat
- **Issue:** #2
- **Fecha:** 2026-11-11

## Objetivo

Crear `docs/api/openapi.yml` con la especificación OpenAPI 3.1 de la API actual, para tener un contrato único y validable que sirva de base a la documentación HTML generada con Redocly.

## Alcance

**Incluye:**

- Fichero `docs/api/openapi.yml` (OpenAPI 3.1) con info, servidor local y etiquetas.
- Endpoints existentes: `GET /health`, `GET /vendehumos` y `POST /vendehumos`.
- Esquemas reutilizables en `components`: `Vendehumo`, `VendehumoInput` (sin `num_votos`), `Categoria` (enum con las categorías del modelo) y `Error` / `ErrorValidacion` (con `detalles`).
- Respuestas documentadas: 200, 201, 400 y el 404 genérico (`Ruta no encontrada`).
- Validación del fichero con `@redocly/cli` (`redocly lint`) y un test de vitest que comprueba que la spec coincide con las rutas reales y con `CATEGORIAS`.

**No incluye:**

- Los endpoints de `/auth` del plan 1: no existen aún. Se documentarán cuando se implementen (lo hará la skill de actualización de documentación).
- Generar el HTML con Redocly ni el script de bash: lo cubre la skill que actualiza la documentación.
- Publicar la documentación (hosting) o servirla desde la API.
- Seguridad (`securitySchemes`): la API no tiene autenticación todavía.

## Archivos afectados

| Archivo | Acción | Motivo |
| --- | --- | --- |
| `docs/api/openapi.yml` | crear | Especificación OpenAPI 3.1 de la API |
| `package.json` | modificar | Añadir `@redocly/cli` y `yaml` como dev, y el script `docs:lint` |
| `tests/docs/openapi.test.js` | crear | Comprueba que la spec cubre las rutas reales y el enum de categorías |
| `CLAUDE.md` | modificar | Documentar la ubicación de la spec y la obligación de mantenerla al cambiar la API |

Depende de que el plan 1 haya instalado vitest, eslint y prettier; si no, la tarea 1 los instala.

## Tareas

Cada tarea debe durar entre 5 y 10 minutos.

- [ ] 1. Instalar como dev `@redocly/cli` y `yaml` (y `vitest` si aún no está), y añadir el script `docs:lint` (`redocly lint docs/api/openapi.yml`) en `package.json`.
- [ ] 2. Escribir `tests/docs/openapi.test.js` que falle: el fichero existe, es OpenAPI 3.1 y define `/health` y `/vendehumos`. Crear `docs/api/openapi.yml` mínimo (`openapi`, `info`, `servers`, `paths` vacíos) para empezar.
- [ ] 3. Documentar `GET /health` (200 con `{ status: 'ok' }`) y ampliar el test para comprobarlo.
- [ ] 4. Definir en `components/schemas` `Categoria` (enum igual a `CATEGORIAS`), `Vendehumo` y `VendehumoInput`, y añadir un test que compare el enum con `CATEGORIAS` del modelo.
- [ ] 5. Definir los esquemas `Error` y `ErrorValidacion` (`error` y `detalles`) y la respuesta reutilizable `NoEncontrado` (404).
- [ ] 6. Documentar `GET /vendehumos` (200, array de `Vendehumo`).
- [ ] 7. Documentar `POST /vendehumos` (cuerpo `VendehumoInput`, 201 con `Vendehumo`, 400 con `ErrorValidacion`).
- [ ] 8. Añadir descripciones, ejemplos y etiquetas, y ejecutar `npm run docs:lint` hasta que no haya errores.
- [ ] 9. Ejecutar prettier, eslint y `npm test`, y actualizar `CLAUDE.md`.

## Criterios de aceptación

- [ ] Existe `docs/api/openapi.yml` y declara `openapi: 3.1.x`.
- [ ] Documenta `GET /health`, `GET /vendehumos` y `POST /vendehumos` con sus respuestas 200, 201 y 400.
- [ ] El enum `Categoria` de la spec es idéntico a `CATEGORIAS` de `src/models/vendehumo.model.js`.
- [ ] `VendehumoInput` no incluye `num_votos` y `Vendehumo` sí.
- [ ] `npm run docs:lint` termina sin errores.
- [ ] Los tests (`vitest`) pasan.
- [ ] `eslint` y `prettier` no reportan errores.

## Dudas y decisiones tomadas

**Dudas pendientes:**

- **Idioma de la spec:** ¿descripciones en español, como el resto del proyecto, o en inglés? Se asume español.
- **URL del servidor:** ¿solo `http://localhost:3000` o hay entornos reales que añadir?
- **Endpoints de `/auth`:** ¿se documentan al implementar el plan 1, o se prefiere esperar a que esté mergeado?

**Decisiones tomadas por mi cuenta:**

- **OpenAPI 3.1:** es la versión actual y Redocly la soporta por completo.
- **`Error` en español:** los mensajes de la API ya están en español (`Ruta no encontrada`, `Datos no válidos`), así que la spec los refleja tal cual.
- **Spec escrita a mano y no generada del código:** la API no usa decoradores ni esquemas que permitan generarla; un test de coherencia con las rutas y el enum evita que se desincronice.
- **`@redocly/cli` como dependencia de desarrollo:** el lint y la generación del HTML son tareas de desarrollo, no de ejecución.
- **Test con `yaml`:** parsear la spec en vitest permite comprobarla sin levantar el servidor.
