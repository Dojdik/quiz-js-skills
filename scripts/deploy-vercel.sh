#!/usr/bin/env bash
# Deploy the React (Vite) client to Vercel.
# NestJS API is NOT deployed here — set VITE_API_URL to your public backend.
#
# Usage:
#   ./scripts/deploy-vercel.sh              # preview deployment
#   ./scripts/deploy-vercel.sh --prod       # production
#   ./scripts/deploy-vercel.sh --prod --yes # non-interactive production
#
# Env (optional):
#   VITE_API_URL   Public API origin, e.g. https://api.example.com
#   VERCEL_TOKEN   CI token (skips browser login)
#   VERCEL_ORG_ID / VERCEL_PROJECT_ID  for CI link

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_DIR="${ROOT_DIR}/client"
PROD=false
YES=false
EXTRA_ARGS=()

usage() {
  cat <<'EOF'
Deploy quiz frontend to Vercel

Usage:
  ./scripts/deploy-vercel.sh [options]

Options:
  --prod          Deploy to production (default: preview)
  --yes, -y       Skip confirmation prompts
  --api-url URL   Set VITE_API_URL for this build
  --token TOKEN   Vercel auth token (or use VERCEL_TOKEN)
  -h, --help      Show this help

Examples:
  ./scripts/deploy-vercel.sh
  VITE_API_URL=https://api.example.com ./scripts/deploy-vercel.sh --prod
  ./scripts/deploy-vercel.sh --prod --api-url https://api.example.com --yes
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod)
      PROD=true
      shift
      ;;
    --yes|-y)
      YES=true
      shift
      ;;
    --api-url)
      export VITE_API_URL="${2:?--api-url requires a value}"
      shift 2
      ;;
    --token)
      export VERCEL_TOKEN="${2:?--token requires a value}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      EXTRA_ARGS+=("$1")
      shift
      ;;
  esac
done

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*"; }
err() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; }

if [[ ! -d "$CLIENT_DIR" ]]; then
  err "Client directory not found: $CLIENT_DIR"
  exit 1
fi

# Prefer local vercel if present, else npx
if command -v vercel >/dev/null 2>&1; then
  VERCEL_CMD=(vercel)
elif command -v npx >/dev/null 2>&1; then
  VERCEL_CMD=(npx --yes vercel@latest)
else
  err "Need Node.js/npm (npx) or vercel CLI installed."
  exit 1
fi

# Auth check (skip with token)
if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  if ! "${VERCEL_CMD[@]}" whoami >/dev/null 2>&1; then
    log "Not logged in to Vercel — running login..."
    "${VERCEL_CMD[@]}" login
  fi
  log "Logged in as: $("${VERCEL_CMD[@]}" whoami 2>/dev/null || echo unknown)"
else
  log "Using VERCEL_TOKEN for authentication"
  EXTRA_ARGS+=(--token "$VERCEL_TOKEN")
fi

if [[ -z "${VITE_API_URL:-}" ]]; then
  warn "VITE_API_URL is not set."
  warn "Production builds will call relative /api (only works with a reverse proxy)."
  warn "For a separate Nest API, pass: --api-url https://your-api.example.com"
  if [[ "$PROD" == true && "$YES" != true ]]; then
    read -r -p "Continue without VITE_API_URL? [y/N] " reply
    if [[ ! "${reply,,}" =~ ^y(es)?$ ]]; then
      err "Aborted."
      exit 1
    fi
  fi
else
  # normalize: no trailing slash
  export VITE_API_URL="${VITE_API_URL%/}"
  log "VITE_API_URL=${VITE_API_URL}"
fi

log "Installing client dependencies..."
npm install --prefix "$CLIENT_DIR"

log "Building client (typecheck + vite)..."
npm run build --prefix "$CLIENT_DIR"

DEPLOY_ARGS=(--cwd "$CLIENT_DIR")
if [[ "$PROD" == true ]]; then
  DEPLOY_ARGS+=(--prod)
  log "Deploying to PRODUCTION..."
else
  log "Deploying PREVIEW..."
fi

if [[ "$YES" == true ]]; then
  DEPLOY_ARGS+=(--yes)
fi

# Pass build env so Vercel rebuild (if any) and local metadata stay consistent
if [[ -n "${VITE_API_URL:-}" ]]; then
  DEPLOY_ARGS+=(--env "VITE_API_URL=${VITE_API_URL}")
  DEPLOY_ARGS+=(--build-env "VITE_API_URL=${VITE_API_URL}")
fi

DEPLOY_ARGS+=("${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}")

log "Running: ${VERCEL_CMD[*]} ${DEPLOY_ARGS[*]}"
# shellcheck disable=SC2068
URL="$("${VERCEL_CMD[@]}" ${DEPLOY_ARGS[@]})"

printf '\n\033[1;32m✓ Deployed\033[0m\n'
printf '  URL: %s\n' "$URL"
printf '\nReminders:\n'
printf '  • NestJS API must be reachable from the browser (CORS).\n'
printf '  • On Nest set CORS_ORIGIN to your Vercel domain(s).\n'
printf '  • Set VITE_API_URL in Vercel project env for future git deploys.\n'
printf '    Dashboard → Project → Settings → Environment Variables\n'
