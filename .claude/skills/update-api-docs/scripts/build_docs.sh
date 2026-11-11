#!/usr/bin/env bash
# Valida docs/api/openapi.yml y genera docs/api/index.html con Redocly.
# Uso: bash .claude/skills/update-api-docs/scripts/build_docs.sh [--skip-lint]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
SPEC="$ROOT_DIR/docs/api/openapi.yml"
OUTPUT="$ROOT_DIR/docs/api/index.html"

skip_lint=false
if [[ "${1:-}" == "--skip-lint" ]]; then
  skip_lint=true
fi

if [[ ! -f "$SPEC" ]]; then
  echo "Error: no existe $SPEC. Crea primero la especificación (ver plans/2-documentacion-openapi.md)." >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx no está disponible. Instala Node.js." >&2
  exit 1
fi

cd "$ROOT_DIR"

if [[ "$skip_lint" == false ]]; then
  echo "==> Validando $SPEC"
  npx --no-install redocly lint "$SPEC"
fi

echo "==> Generando $OUTPUT"
npx --no-install redocly build-docs "$SPEC" --output "$OUTPUT"

echo "==> Documentación generada en $OUTPUT"
