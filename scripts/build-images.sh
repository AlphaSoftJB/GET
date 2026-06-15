#!/usr/bin/env bash
# build-images.sh - Build all GET Docker images with proper tags
# Usage: ./scripts/build-images.sh [--push] [--platform linux/amd64,linux/arm64]

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

PUSH=false
PLATFORM=""
REGISTRY=""
EXTRA_TAG=""

if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  EXTRA_TAG=$(git rev-parse --short HEAD 2>/dev/null || true)
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --push)        PUSH=true ;;
    --platform)    PLATFORM="$2"; shift ;;
    --registry)    REGISTRY="${2%/}/"; shift ;;
    --tag)         EXTRA_TAG="$2"; shift ;;
    -h|--help)     sed -n '2,25p' "$0"; exit 0 ;;
    *)             error "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

header "Checking prerequisites"

if ! command -v docker &>/dev/null; then
  error "Docker is not installed or not in PATH."
  exit 1
fi
success "Docker $(docker --version | awk '{print $3}' | tr -d ',')"

if [[ -n "$PLATFORM" ]]; then
  if ! docker buildx version &>/dev/null; then
    error "Docker Buildx is required for multi-platform builds but was not found."
    exit 1
  fi
  success "Docker Buildx available"
  BUILD_CMD="docker buildx build --platform $PLATFORM"
  [[ "$PUSH" == true ]] && BUILD_CMD+=" --push"
else
  BUILD_CMD="docker build"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
info "Repository root: $REPO_ROOT"

declare -a IMAGES=(
  "backend|backend/Dockerfile|backend|get-backend"
  "admin-web|admin-web/Dockerfile|admin-web|get-admin-web"
  "frontend|frontend/Dockerfile|frontend|get-frontend"
)

build_image() {
  local service="$1" dockerfile="$2" context="$3" basename="$4"
  local latest_tag="${REGISTRY}${basename}:latest"
  local sha_tag=""
  [[ -n "$EXTRA_TAG" ]] && sha_tag="${REGISTRY}${basename}:${EXTRA_TAG}"
  header "Building: $service -> $latest_tag"
  local abs_dockerfile="$REPO_ROOT/$dockerfile"
  local abs_context="$REPO_ROOT/$context"
  if [[ ! -f "$abs_dockerfile" ]]; then
    error "Dockerfile not found: $abs_dockerfile"
    return 1
  fi
  local cmd=($BUILD_CMD --file "$abs_dockerfile" --tag "$latest_tag")
  [[ -n "$sha_tag" ]] && cmd+=(--tag "$sha_tag")
  if [[ -n "$PLATFORM" && "$PUSH" == false ]]; then
    cmd+=(--load)
  fi
  cmd+=("$abs_context")
  local start_ts
  start_ts=$(date +%s)
  if "${cmd[@]}"; then
    local end_ts elapsed
    end_ts=$(date +%s)
    elapsed=$(( end_ts - start_ts ))
    success "Built $latest_tag in ${elapsed}s"
  else
    error "Failed to build $service"
    return 1
  fi
}

push_image() {
  local basename="$1"
  local latest_tag="${REGISTRY}${basename}:latest"
  info "Pushing $latest_tag ..."
  docker push "$latest_tag"
  success "Pushed $latest_tag"
}

header "GET - Docker Image Build"
FAILED_SERVICES=()

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r svc dockerfile context basename <<< "$entry"
  if ! build_image "$svc" "$dockerfile" "$context" "$basename"; then
    FAILED_SERVICES+=("$svc")
  fi
done

if [[ "$PUSH" == true && -z "$PLATFORM" ]]; then
  header "Pushing images to registry"
  for entry in "${IMAGES[@]}"; do
    IFS='|' read -r svc dockerfile context basename <<< "$entry"
    if ! push_image "$basename"; then
      FAILED_SERVICES+=("${svc}-push")
    fi
  done
fi

header "Build Summary"
if [[ ${#FAILED_SERVICES[@]} -eq 0 ]]; then
  success "All images built successfully."
  exit 0
else
  error "The following services failed to build:"
  for svc in "${FAILED_SERVICES[@]}"; do echo "  - $svc"; done
  exit 1
fi
