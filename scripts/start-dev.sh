#!/usr/bin/env bash
# start-dev.sh - Start the GET development environment
# Usage: ./scripts/start-dev.sh [--no-build] [--timeout <seconds>]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; }
header()  { echo -e "\n${BOLD}${CYAN}=== $* ===${RESET}\n"; }

BUILD_FLAG="--build"
HEALTH_TIMEOUT=120

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-build)  BUILD_FLAG="" ;;
    --timeout)   HEALTH_TIMEOUT="$2"; shift ;;
    -h|--help)   sed -n '2,20p' "$0"; exit 0 ;;
    *)           error "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$REPO_ROOT/docker-compose.yml"
ENV_FILE="$REPO_ROOT/.env"
ENV_EXAMPLE="$REPO_ROOT/.env.example"

header "Checking prerequisites"

if ! command -v docker &>/dev/null; then
  error "Docker is not installed."
  exit 1
fi
success "Docker $(docker --version | grep -oP '\d+\.\d+\.\d+' | head -1)"

if ! docker info &>/dev/null 2>&1; then
  error "Docker daemon is not running."
  exit 1
fi
success "Docker daemon is running"

if ! docker compose version &>/dev/null 2>&1; then
  error "Docker Compose v2 is not available."
  exit 1
fi
success "Docker Compose $(docker compose version --short 2>/dev/null || echo 'v2')"

if ! command -v curl &>/dev/null; then
  warn "curl not found - health checks will be skipped."
  SKIP_HEALTH=true
else
  SKIP_HEALTH=false
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  error "docker-compose.yml not found"
  exit 1
fi

header "Environment configuration"

if [[ -f "$ENV_FILE" ]]; then
  info ".env already exists - skipping copy."
else
  if [[ -f "$ENV_EXAMPLE" ]]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    success "Copied .env.example -> .env"
    warn "Review $ENV_FILE and set any required secrets before first use."
  else
    warn ".env.example not found. Creating a minimal .env stub."
    cat > "$ENV_FILE" <<'EOF'
POSTGRES_USER=get_user
POSTGRES_PASSWORD=get_dev_password
POSTGRES_DB=get_db
DATABASE_URL=postgresql://get_user:get_dev_password@db:5432/get_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=true
BACKEND_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000
FRONTEND_PORT=3000
ADMIN_WEB_PORT=3001
ADMIN_API_URL=http://localhost:8000
EOF
    success "Created minimal .env"
  fi
fi

header "Starting services"
docker compose -f "$COMPOSE_FILE" up $BUILD_FLAG -d
success "Docker Compose has started all services."

declare -a HEALTH_CHECKS=(
  "backend|http://localhost:8000/api/health|Backend API"
  "frontend|http://localhost:3000|Frontend"
  "admin-web|http://localhost:3001|Admin Web"
)

wait_for_healthy() {
  local service="$1" url="$2" label="$3"
  local elapsed=0 interval=3
  info "Waiting for $label to be healthy ($url) ..."
  while true; do
    if curl -sf --max-time 3 "$url" -o /dev/null 2>/dev/null; then
      success "$label is healthy"
      return 0
    fi
    if (( elapsed >= HEALTH_TIMEOUT )); then
      warn "$label did not become healthy within ${HEALTH_TIMEOUT}s."
      return 1
    fi
    sleep "$interval"
    (( elapsed += interval ))
  done
}

if [[ "$SKIP_HEALTH" == false ]]; then
  header "Health checks"
  UNHEALTHY=()
  for entry in "${HEALTH_CHECKS[@]}"; do
    IFS='|' read -r svc url label <<< "$entry"
    wait_for_healthy "$svc" "$url" "$label" || UNHEALTHY+=("$label")
  done
  if [[ ${#UNHEALTHY[@]} -gt 0 ]]; then
    warn "Some services did not pass health checks: ${UNHEALTHY[*]}"
  else
    success "All services are healthy."
  fi
fi

header "GET Development Environment Ready"
echo "  Backend API:  http://localhost:8000"
echo "  Frontend:     http://localhost:3000"
echo "  Admin Web:    http://localhost:3001"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"
