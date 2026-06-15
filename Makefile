# =============================================================================
# GET (Groceries Expiration Tracking) - Makefile
# Usage: make <target>
# Requires: Docker Engine 24+, Docker Compose v2 (docker compose)
# =============================================================================

COMPOSE        := docker compose
COMPOSE_FILE   := docker-compose.yml
COMPOSE_PROD   := docker-compose.prod.yml
PROJECT_NAME   := get

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo ""
	@echo "  GET - Groceries Expiration Tracking"
	@echo "  ====================================="
	@echo ""
	@echo "  Usage: make <target>"
	@echo ""
	@echo "  Development"
	@echo "  -----------"
	@echo "  start        Start all services in the background"
	@echo "  stop         Stop all running services"
	@echo "  build        Build (or rebuild) all Docker images"
	@echo "  logs         Tail logs from all services (Ctrl-C to exit)"
	@echo "  clean        Stop services and remove containers, volumes, and images"
	@echo ""
	@echo "  Database"
	@echo "  --------"
	@echo "  db-migrate   Run pending database migrations"
	@echo "  db-seed      Seed the database with development fixture data"
	@echo ""
	@echo "  Quality"
	@echo "  -------"
	@echo "  test         Run the full test suite across all services"
	@echo ""
	@echo "  Other"
	@echo "  -----"
	@echo "  help         Show this help message (default)"
	@echo ""

.PHONY: start
start:
	@echo ">>> Starting GET services..."
	$(COMPOSE) -f $(COMPOSE_FILE) up --build -d
	@echo ""
	@echo "Services are up. Access points:"
	@echo "  Backend API   : http://localhost:8000"
	@echo "  Frontend      : http://localhost:3000"
	@echo "  Admin Web     : http://localhost:3001"
	@echo "  PostgreSQL    : localhost:5432"
	@echo "  Redis         : localhost:6379"
	@echo ""

.PHONY: stop
stop:
	@echo ">>> Stopping GET services..."
	$(COMPOSE) -f $(COMPOSE_FILE) stop
	@echo ">>> All services stopped."

.PHONY: build
build:
	@echo ">>> Building all Docker images..."
	$(COMPOSE) -f $(COMPOSE_FILE) build --no-cache
	@echo ">>> Build complete."

.PHONY: test
test:
	@echo ">>> Running backend tests..."
	$(COMPOSE) -f $(COMPOSE_FILE) run --rm backend pytest --tb=short -q
	@echo ""
	@echo ">>> Running frontend tests..."
	$(COMPOSE) -f $(COMPOSE_FILE) run --rm frontend npm test -- --watchAll=false --ci
	@echo ""
	@echo ">>> Running admin-web tests..."
	$(COMPOSE) -f $(COMPOSE_FILE) run --rm admin-web npm test -- --watchAll=false --ci
	@echo ""
	@echo ">>> All tests passed."

.PHONY: logs
logs:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100

.PHONY: db-migrate
db-migrate:
	@echo ">>> Running database migrations..."
	$(COMPOSE) -f $(COMPOSE_FILE) run --rm backend alembic upgrade head
	@echo ">>> Migrations complete."

.PHONY: db-seed
db-seed:
	@echo ">>> Seeding database with development data..."
	$(COMPOSE) -f $(COMPOSE_FILE) run --rm backend python -m app.scripts.seed_db
	@echo ">>> Database seeded."

.PHONY: clean
clean:
	@echo ">>> Removing containers, networks, volumes, and images..."
	$(COMPOSE) -f $(COMPOSE_FILE) down --volumes --rmi local --remove-orphans
	@echo ">>> Clean complete. All GET Docker artifacts removed."
