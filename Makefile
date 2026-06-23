# ─────────────────────────────────────────────────────────────
#  LIFECYCLE
# ─────────────────────────────────────────────────────────────

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up -d --build

logs:
	docker-compose logs -f

status:
	docker-compose ps

# ─────────────────────────────────────────────────────────────
#  FRONTEND
# ─────────────────────────────────────────────────────────────

check:
	docker-compose exec -T -w /app frontend npm run check

lint:
	docker-compose exec -T -w /app frontend npm run lint

format:
	docker-compose exec -T -w /app frontend npm run format

# ─────────────────────────────────────────────────────────────
#  INFO
# ─────────────────────────────────────────────────────────────

links:
	@echo "------------------------------------------------------"
	@echo "BRINDICIS STOCK APP REACHABLE AT:"
	@echo "------------------------------------------------------"
	@echo "Frontend:   http://localhost:5176"
	@echo "------------------------------------------------------"

help:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  LIFECYCLE"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make up          Start frontend service"
	@echo "  make down        Stop services"
	@echo "  make build       Rebuild + start"
	@echo "  make logs        Follow logs"
	@echo "  make status      Show services"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  FRONTEND"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make check       Run svelte-check"
	@echo "  make lint        Run eslint"
	@echo "  make format      Run prettier --write"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  INFO"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make links       Show URLs"
	@echo "  make help        Show this help"

.PHONY: up down build logs status check lint format links help
