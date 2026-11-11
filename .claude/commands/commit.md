---
description: Crea un commit siguiendo la especificación de Conventional Commits
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
argument-hint: [mensaje o contexto opcional]
---

## Contexto

- Estado del repositorio: !`git status --short`
- Cambios en staging: !`git diff --cached`
- Cambios sin stage: !`git diff`
- Últimos commits (para seguir el estilo): !`git log --oneline -5`

## Tarea

Crea un commit que siga la especificación de [Conventional Commits 1.0.0](https://www.conventionalcommits.org/es/v1.0.0/).

Contexto adicional del usuario (puede estar vacío): $ARGUMENTS

### Formato

```
<tipo>[ámbito opcional][!]: <descripción>

[cuerpo opcional]

[pie(s) opcional(es)]
```

### Tipos permitidos

- `feat`: nueva funcionalidad (SemVer MINOR)
- `fix`: corrección de un error (SemVer PATCH)
- `docs`: solo documentación
- `style`: formato que no afecta al código (espacios, comillas, punto y coma)
- `refactor`: cambio de código que no corrige un error ni añade funcionalidad
- `perf`: mejora de rendimiento
- `test`: añadir o corregir tests
- `build`: sistema de build o dependencias (npm, etc.)
- `ci`: configuración de integración continua
- `chore`: otras tareas que no tocan `src` ni tests
- `revert`: revierte un commit anterior

### Reglas

1. Analiza los cambios y elige el tipo que mejor los describa. Si hay cambios de naturaleza distinta, propón dividirlos en varios commits y haz un commit por cada grupo.
2. El ámbito es opcional y va entre paréntesis, p. ej. `feat(vendehumos): ...`. Usa el nombre de la capa o módulo afectado (`routes`, `controllers`, `services`, `repositories`, `models`, `db`...).
3. La descripción va en minúsculas, en imperativo, sin punto final y con un máximo de ~72 caracteres. Escríbela en español, salvo que el historial use otro idioma.
4. Usa el cuerpo solo si el "por qué" no es evidente; sepáralo del título con una línea en blanco.
5. Los cambios incompatibles se marcan con `!` tras el tipo/ámbito y/o con un pie `BREAKING CHANGE: <descripción>`.
6. Si no hay nada en staging, añade con `git add` solo los archivos relevantes (nunca `git add .` a ciegas; no incluyas `data/*.db`, `node_modules` ni secretos).
7. No hagas `git push`, no uses `--amend` ni `--no-verify`.
8. Termina el mensaje con la línea de atribución indicada en las instrucciones del sistema, si existe.
9. Si no hay cambios que commitear, dilo y no hagas nada.

Al terminar, muestra el mensaje del commit creado.
