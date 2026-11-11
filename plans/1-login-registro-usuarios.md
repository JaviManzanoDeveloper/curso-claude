# 1 - Login y registro de usuarios con JWT

- **Tipo:** feat
- **Issue:** #1
- **Fecha:** 2026-11-05

## Objetivo

Permitir que los usuarios se registren (nombre, email, contraseña y rol) y hagan login con email y contraseña. El login devuelve un token JWT firmado con `jsonwebtoken` que caduca a las 24 h. La contraseña se guarda siempre hasheada.

## Alcance

**Incluye:**

- Tabla `usuarios` en SQLite con `nombre`, `email` (único), `password_hash` y `rol`.
- Roles permitidos: `admin`, `usuario-free` y `usuario` (enum `ROLES` en el modelo).
- Endpoints `POST /auth/register` y `POST /auth/login`.
- Hash de contraseña y verificación.
- Generación de JWT con caducidad de 24 h (`expiresIn: '24h'`) y función para verificarlo.
- Validación de entrada y errores 400, 401 y 409.
- Tests con vitest, configuración de eslint y prettier.

**No incluye:**

- Proteger los endpoints de `/vendehumos` con el token ni aplicar permisos por rol (se deja el token verificable para una issue posterior).
- Refresh tokens, logout, revocación de tokens ni recuperación de contraseña.
- Endpoints para listar, editar o borrar usuarios.
- Verificación del email.

## Archivos afectados

| Archivo | Acción | Motivo |
| --- | --- | --- |
| `package.json` | modificar | Añadir `jsonwebtoken`, y como dev `vitest`, `eslint` y `prettier`; scripts `test`, `lint` y `format` |
| `src/models/usuario.model.js` | crear | Enum `ROLES` y `to_usuario` (nunca expone `password_hash`) |
| `src/db.js` | modificar | Crear la tabla `usuarios` con `CHECK` de rol construido desde `ROLES` y `email` `UNIQUE` |
| `src/repositories/usuarios.repository.js` | crear | SQL: insertar usuario y buscar por email |
| `src/utils/password.js` | crear | Funciones puras `hash_password` y `verify_password` |
| `src/utils/token.js` | crear | `sign_token` y `verify_token` con `jsonwebtoken` (24 h) |
| `src/utils/validation.js` | modificar | Añadir `validate_register_input` y `validate_login_input` |
| `src/utils/errors.js` | modificar | Añadir `ConflictError` (409) y `AuthError` (401) |
| `src/services/auth.service.js` | crear | Lógica de `register_usuario` y `login_usuario` |
| `src/controllers/auth.controller.js` | crear | HTTP a servicio; mapea `ValidationError` a 400, `ConflictError` a 409 y `AuthError` a 401 |
| `src/routes/auth.routes.js` | crear | Rutas `POST /register` y `POST /login` |
| `src/app.js` | modificar | Montar `/auth` |
| `vitest.config.js` | crear | Configuración de vitest (usa `DB_PATH=:memory:`) |
| `eslint.config.js` | crear | Configuración de eslint |
| `.prettierrc` | crear | `semi: false`, `singleQuote: true` |
| `tests/utils/password.test.js` | crear | Tests del hash |
| `tests/utils/token.test.js` | crear | Tests del JWT y su caducidad |
| `tests/routes/auth.test.js` | crear | Tests de integración de registro y login |
| `data/vendehumos.db` | eliminar si existe | `CREATE TABLE IF NOT EXISTS` crea la tabla nueva sin tocar las existentes, así que no es obligatorio; solo hay que borrarlo si se prefiere partir de cero |
| `CLAUDE.md` | modificar | Documentar `JWT_SECRET`, la tabla `usuarios` y la capa de auth |

## Tareas

Cada tarea debe durar entre 5 y 10 minutos.

- [ ] 1. Instalar `jsonwebtoken` y las dependencias de desarrollo (`vitest`, `eslint`, `prettier`) y añadir los scripts `test`, `lint` y `format` en `package.json`.
- [ ] 2. Crear `.prettierrc`, `eslint.config.js` y `vitest.config.js` y comprobar que `npm test` arranca sin tests.
- [ ] 3. Crear `src/models/usuario.model.js` con `ROLES = ['admin', 'usuario-free', 'usuario']` y `to_usuario(row)`.
- [ ] 4. Añadir en `src/db.js` la tabla `usuarios` (`id`, `nombre`, `email` UNIQUE, `password_hash`, `rol` con `CHECK` desde `ROLES`).
- [ ] 5. Añadir `ConflictError` y `AuthError` en `src/utils/errors.js`.
- [ ] 6. Crear `src/utils/password.js` con `hash_password` y `verify_password` (comparación en tiempo constante) y su test.
- [ ] 7. Crear `src/utils/token.js` con `sign_token(usuario)` (payload `sub`, `rol`; `expiresIn: '24h'`) y `verify_token`; el secreto sale de `JWT_SECRET` y falla al arrancar si no existe fuera de tests. Añadir su test, incluida la caducidad.
- [ ] 8. Añadir `validate_register_input` y `validate_login_input` en `src/utils/validation.js` (nombre, email con formato válido, contraseña de al menos 8 caracteres, rol dentro de `ROLES`).
- [ ] 9. Crear `src/repositories/usuarios.repository.js` con `insert_usuario` y `find_usuario_by_email`.
- [ ] 10. Crear `src/services/auth.service.js` con `register_usuario`: valida, normaliza el email a minúsculas, comprueba que no exista (409), hashea e inserta.
- [ ] 11. Añadir `login_usuario` en `auth.service.js`: busca por email, verifica la contraseña, devuelve `{ token, usuario }` y da el mismo error 401 genérico para email desconocido o contraseña errónea.
- [ ] 12. Crear `src/controllers/auth.controller.js` y `src/routes/auth.routes.js` y montar `/auth` en `src/app.js`.
- [ ] 13. Escribir `tests/routes/auth.test.js`: registro correcto (201), validación (400), email duplicado (409), login correcto (200 con token) y login incorrecto (401).
- [ ] 14. Ejecutar `prettier`, `eslint` y `npm test`, corregir lo que falle y actualizar `CLAUDE.md`.

## Criterios de aceptación

- [ ] `POST /auth/register` con datos válidos devuelve 201 y un cuerpo con `id`, `nombre`, `email` y `rol`, sin `password` ni `password_hash`.
- [ ] En la base de datos la columna `password_hash` nunca contiene la contraseña en claro.
- [ ] `POST /auth/register` con campos que faltan, email mal formado, contraseña de menos de 8 caracteres o un rol que no sea `admin`, `usuario-free` o `usuario` devuelve 400 con `detalles`.
- [ ] `POST /auth/register` con un email ya registrado (sin distinguir mayúsculas) devuelve 409.
- [ ] `POST /auth/login` con credenciales correctas devuelve 200 con un `token` y los datos del usuario.
- [ ] El token decodificado contiene el id del usuario y su rol, y su `exp` es exactamente 24 h posterior a su `iat`.
- [ ] `verify_token` rechaza un token caducado, manipulado o firmado con otro secreto.
- [ ] `POST /auth/login` con email inexistente o contraseña incorrecta devuelve 401 con el mismo mensaje en ambos casos.
- [ ] Los endpoints `/vendehumos` y `/health` siguen funcionando igual que antes.
- [ ] `npm test` pasa, `eslint` no reporta errores y `prettier --check` no encuentra diferencias.

## Dudas y decisiones tomadas

**Dudas pendientes:**

- **Asignación del rol en el registro:** el enunciado pide el rol al usuario, así que `POST /auth/register` lo acepta en el cuerpo. Eso permite que cualquiera se registre como `admin`. ¿Es lo deseado o prefieres que el registro público solo permita `usuario` y `usuario-free`, y que `admin` se asigne por otra vía?
- **Contraseña:** ¿qué política exige (mínimo 8 caracteres, mayúsculas, números)?
- **Protección de rutas:** ¿se quiere un middleware que exija el token en `/vendehumos` en esta misma issue, o en otra posterior?

**Decisiones tomadas por mi cuenta:**

- **Hash con `node:crypto` (`scrypt`) en lugar de `bcrypt`:** no añade dependencias nativas y encaja con el uso de `node:sqlite`. Se guarda `salt:hash` en `password_hash`. Si prefieres `bcrypt`, solo cambia `src/utils/password.js`.
- **Secreto en `JWT_SECRET`:** se lee de una variable de entorno y no se pone ningún valor por defecto en el código. En tests se fija uno de prueba.
- **Email único y en minúsculas:** se normaliza antes de guardar y de buscar.
- **Mismo 401 para email desconocido y contraseña errónea:** evita revelar qué emails están registrados.
- **Registro sin token:** `register` devuelve el usuario, no el token; hay que hacer login después.
- **Rutas bajo `/auth`:** por coherencia con `/vendehumos`.
- **Tests con base de datos en memoria:** `DB_PATH=:memory:` para no ensuciar `data/vendehumos.db`.
- **Orden de pasos y tipos de error:** `ConflictError` y `AuthError` se añaden a `errors.js` para mantener el patrón actual de `ValidationError`.
