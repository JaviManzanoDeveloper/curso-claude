---
name: update-api-docs
description: Actualiza docs/api/openapi.yml cuando cambia la API (rutas, controladores, validaciones, modelos o respuestas) y regenera la documentación HTML con Redocly. Úsalo siempre que se añada, modifique o elimine un endpoint, un campo o un código de respuesta, o cuando el usuario pida actualizar o generar la documentación de la API.
argument-hint: [descripción del cambio en la API (opcional)]
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# update-api-docs

Mantén sincronizada la documentación de la API con el código. Contexto del cambio (puede estar vacío): $ARGUMENTS

La especificación vive en `docs/api/openapi.yml` (OpenAPI 3.1) y es la única fuente de verdad. El HTML (`docs/api/index.html`) se genera a partir de ella y nunca se edita a mano.

## Pasos

1. **Comprueba que existe la spec.** Si `docs/api/openapi.yml` no existe, avisa de que hay que crearla antes (plan `plans/2-documentacion-openapi.md`) y no la inventes de golpe.
2. **Detecta qué ha cambiado en la API.** Si hay repositorio git, mira `git diff` y `git status`; si no, usa `$ARGUMENTS` y revisa el código. Lee las capas afectadas:
   - `src/app.js` y `src/routes/`: rutas y métodos (incluido `/health` y los montajes como `/vendehumos` o `/auth`).
   - `src/controllers/`: códigos de estado y cuerpos de respuesta.
   - `src/utils/validation.js` y `src/services/`: campos obligatorios, restricciones y errores (400, 401, 409...).
   - `src/models/`: forma de las respuestas (`to_*`) y enums como `CATEGORIAS` o `ROLES`.
   - `src/middlewares/error_handler.js`: formato de los errores.
3. **Actualiza `docs/api/openapi.yml`** con Edit, solo en lo que haya cambiado:
   - Endpoint nuevo, modificado o eliminado en `paths`, con `summary`, `tags`, parámetros, `requestBody` y todas las respuestas reales.
   - Esquemas en `components/schemas` reutilizables con `$ref`; no dupliques definiciones.
   - Los enums de la spec deben coincidir exactamente con los del código (`CATEGORIAS`, `ROLES`).
   - Los campos que la API no acepta en la entrada (por ejemplo `num_votos` al crear) no aparecen en el esquema de entrada.
   - No documentes lo que no existe en el código, y no dejes documentado lo que se ha eliminado.
   - Descripciones en español, como el resto del proyecto.
4. **Genera el HTML** ejecutando el script (valida con `redocly lint` y luego construye con `redocly build-docs`):

   ```bash
   bash .claude/skills/update-api-docs/scripts/build_docs.sh
   ```

   Si el lint falla, corrige la spec y repite. Usa `--skip-lint` solo si el usuario lo pide.
5. **Si falta `@redocly/cli`** (el script falla porque `npx --no-install` no lo encuentra), instálalo con `npm install --save-dev @redocly/cli` y repite.
6. **Verifica y responde.** Comprueba que `docs/api/index.html` existe y se ha actualizado. Responde con los endpoints o esquemas que has añadido, cambiado o eliminado, y el resultado del lint.

## Reglas

- No modifiques código fuente: esta skill solo toca `docs/api/`.
- No edites `docs/api/index.html` a mano: se regenera siempre con el script.
- Si el código y la spec se contradicen y no está claro cuál es el correcto, no adivines: pregunta al usuario.
- Si el cambio de API no afecta a nada documentado (refactor interno), dilo y no cambies la spec, pero regenera el HTML solo si la spec cambió.
- No hagas `git commit`; si el usuario quiere commitear, que use `/commit`.
