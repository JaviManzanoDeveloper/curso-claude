---
name: plan-feature
description: Planifica una nueva funcionalidad o el arreglo de un error usando una plantilla común y guarda el plan en plans/<num_issue>-<breve-descripcion>.md. Úsalo cuando el usuario pida planificar, diseñar o preparar una feature o un bug antes de implementarlo.
argument-hint: <num_issue> <descripción de la funcionalidad o error>
allowed-tools: Read, Glob, Grep, Write, mcp__slack__slack_post_message
---

# plan-feature

Genera un plan de implementación para: $ARGUMENTS

## Pasos

1. **Interpreta los argumentos.** El primer valor es el número de issue y el resto la descripción. Si falta el número de issue, pídelo al usuario antes de continuar. No lo inventes.
2. **Explora el código** (solo lectura) para entender qué capas se ven afectadas. Lee `CLAUDE.md` y sigue la arquitectura por capas del proyecto: `routes` → `controllers` → `services` → `repositories` → `models`/`utils`, y `src/db.js` para el esquema.
3. **Rellena la plantilla** [template.md](template.md) respetando exactamente sus secciones y su orden. No añadas, quites ni renombres secciones.
4. **Guarda el plan** en `plans/<num_issue>-<breve-descripcion>.md` (crea la carpeta `plans` si no existe).
   - `<breve-descripcion>`: 2-5 palabras en minúsculas, en español, sin tildes ni caracteres especiales, separadas por guiones. Ejemplo: `142-votar-vendehumo.md`.
   - Si el archivo ya existe, no lo sobrescribas sin preguntar.
5. **Responde** con la ruta del archivo creado y un resumen de 2-3 líneas. Destaca las dudas abiertas para que el usuario pueda contestarlas.
6. **Avisa por Slack.** Como último paso, envía un mensaje al canal `curso-claude-ed3` con la herramienta de Slack disponible (`slack_post_message` del MCP `slack`) indicando que ya se ha planificado la tarea. Incluye el número de issue, el título del plan y la ruta del archivo. Ejemplo: `📝 Planificada la issue #142: votar vendehumo → plans/142-votar-vendehumo.md`.
   - Envíalo solo si el plan se ha guardado correctamente.
   - Si la herramienta de Slack no está disponible o el envío falla, no lo consideres un error del plan: dilo al usuario en la respuesta y no lo reintentes en bucle.

## Reglas de contenido

- **Objetivo:** una o dos frases sobre qué se consigue y por qué. Indica si es `feat` o `fix`.
- **Alcance:** separa lo que entra y lo que queda explícitamente fuera.
- **Archivos afectados:** rutas reales del repositorio (verificadas con Glob/Grep). Indica si cada una se crea, modifica o elimina y por qué. Incluye los tests y, si cambia el esquema, la migración o el borrado de `data/vendehumos.db`.
- **Tareas:** lista de comprobación ordenada. Cada tarea debe poder hacerse en **5-10 minutos**. Si es más grande, divídela. Si es más pequeña, agrúpala. Cada tarea debe ser concreta y verificable. Sigue las convenciones del proyecto: funciones en `snake_case`, prettier (sin `;`, comillas simples), eslint y tests con vitest.
- **Criterios de aceptación:** condiciones observables y comprobables (códigos HTTP, cuerpos de respuesta, tests que pasan, lint sin errores). Redáctalos de forma que cualquiera pueda decir sí o no.
- **Dudas y decisiones tomadas:** sección final obligatoria. Lista las dudas pendientes para el usuario y todas las decisiones que hayas tomado por tu cuenta, con su justificación. Si no hay ninguna, escribe "Ninguna".

## Límites

- Este skill solo planifica: no modifiques código fuente, solo crea el archivo del plan.
- No inventes archivos, endpoints ni funciones existentes. Si algo no existe aún, marca que se creará.
