---
name: implement-plan
description: Implementa un plan de plans/<num_issue>-<breve-descripcion>.md en una rama propia creada desde development, aplicando TDD estricto tarea a tarea, marcando cada tarea como hecha y haciendo un commit por tarea. Úsalo cuando el usuario pida implementar, ejecutar o desarrollar un plan ya escrito.
argument-hint: <ruta o nombre del plan>
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Skill, mcp__slack__slack_post_message
---

# implement-plan

Implementa el plan: $ARGUMENTS

## 1. Localizar el plan

1. Resuelve `$ARGUMENTS` a un archivo de `plans/`. Acepta la ruta completa, el nombre con o sin `.md`, o solo el número de issue (busca con Glob `plans/<num>-*.md`).
2. Si no se pasa nada, hay varios candidatos o no existe, pregunta al usuario. No adivines.
3. Lee el plan completo. Si la sección "Dudas y decisiones tomadas" tiene dudas pendientes que afecten a la implementación, plantéaselas al usuario antes de empezar.
4. El nombre del plan es el nombre del archivo sin `.md` (ejemplo: `1-login-registro-usuarios`). Se usa como nombre de la rama.

## 2. Preparar la rama

Ejecuta estos pasos en orden con `git`:

1. Comprueba que el directorio es un repositorio (`git rev-parse --is-inside-work-tree`). Si no lo es, avisa al usuario y no continúes.
2. Comprueba que el árbol de trabajo está limpio (`git status --short`). Si hay cambios sin commitear, pregunta al usuario qué hacer; no los pierdas ni los mezcles con el plan.
3. Si `development` no existe (`git rev-parse --verify development`), créala desde `main`: `git branch development main`. Si `main` tampoco existe, avisa y para.
4. Crea la rama del plan desde `development` y cámbiate a ella: `git switch -c <nombre-del-plan> development`.
   - Si la rama del plan ya existe, no la recrees ni la sobrescribas: pregunta al usuario si continuar en ella (reanudar).
5. Nunca hagas `git push`, ni trabajes directamente sobre `main` o `development`.

## 3. Implementar tarea a tarea

Recorre las tareas de la sección "Tareas" en orden, saltando las que ya estén marcadas `[x]`. Para **cada** tarea:

1. **Rojo:** escribe primero el test (vitest) que describe el comportamiento de la tarea. Ejecútalo (`npx vitest run <archivo>`) y comprueba que **falla por la razón esperada**, no por un error de sintaxis o de import. Si la tarea no tiene lógica comprobable (instalar dependencias, crear configuración, documentación), usa como "test" una comprobación verificable (por ejemplo, que `npm test` arranca o que `eslint` pasa) y dilo explícitamente.
2. **Verde:** escribe el código mínimo para que el test pase. Ejecuta el test y confirma que pasa. No escribas código sin un test en rojo que lo justifique.
3. **Refactor:** limpia sin cambiar el comportamiento y vuelve a ejecutar los tests. Ejecuta toda la suite (`npm test`) para detectar regresiones.
4. **Marcar:** solo cuando el test pasa con el código implementado, cambia en el plan `- [ ]` por `- [x]` en esa tarea (con Edit). Marca únicamente esa tarea.
5. **Commit:** invoca el slash command `/commit` (Skill `commit`) para crear el commit de la tarea. Incluye en él el código, los tests y el plan actualizado. Pasa como contexto el número y el título de la tarea.
6. Pasa a la siguiente tarea.

## Reglas

- **TDD estricto:** nunca marques una tarea ni hagas commit con tests en rojo. Nunca escribas el código antes del test.
- **Una tarea, un commit.** Si una tarea resulta demasiado grande, no la mezcles con otra: avisa al usuario.
- Sigue las convenciones de `CLAUDE.md`: funciones en `snake_case`, prettier (sin `;`, comillas simples), eslint y vitest. Respeta la arquitectura por capas.
- Si un test falla y no consigues arreglarlo tras varios intentos razonables, detente, deja la tarea sin marcar, sin commit, y explica el bloqueo al usuario.
- Si el plan es incorrecto o incompleto (archivo que no existe, tarea contradictoria), no improvises en silencio: avisa y pregunta.
- No modifiques las secciones del plan salvo las casillas de las tareas. Las casillas de "Criterios de aceptación" se marcan al final, solo tras comprobar cada una.
- No hagas `git push`, `--amend` ni `--no-verify`.

## 4. Cierre

1. Cuando todas las tareas estén en `[x]`, ejecuta `npm test`, `eslint` y `prettier --check` y comprueba los criterios de aceptación. Marca los que se cumplan; si hace falta, haz un último commit con `/commit`.
2. **Avisa por Slack.** Como último paso, envía un mensaje al canal `curso-claude-ed3` (ID `C0CGZ01R9M2`; usa siempre el ID como `channel_id`, no el nombre) con la herramienta de Slack disponible (`slack_post_message` del MCP `slack`) indicando que ya se ha implementado el plan. Incluye el nombre del plan, la rama y el número de tareas completadas. Ejemplo: `✅ Implementado el plan 1-login-registro-usuarios en la rama 1-login-registro-usuarios (14/14 tareas)`.
   - Envíalo solo si todas las tareas están en `[x]` y los tests pasan. Si quedan tareas pendientes o hay un bloqueo, no avises de que está implementado: dilo en la respuesta.
   - Si la herramienta de Slack no está disponible o el envío falla, no lo consideres un error de la implementación: dilo al usuario en la respuesta y no lo reintentes en bucle.
3. Responde con: la rama creada, las tareas completadas (y las pendientes si las hay), el resultado de los tests, si se envió el aviso a Slack y cualquier duda o desviación del plan.
