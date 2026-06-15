# ─────────────────────────────────────────────────────────────
#  LIFECYCLE
# ─────────────────────────────────────────────────────────────

up:
	docker-compose up -d

down:
	docker-compose down

pre-build:
	./copy-api-client.sh

build: pre-build
	docker-compose up -d --build

logs:
	docker-compose logs -f

status:
	docker-compose ps

# ─────────────────────────────────────────────────────────────
#  FRONTEND
# ─────────────────────────────────────────────────────────────

gen-routes:
	docker-compose exec -T -w /app frontend npm run gen-routes

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
	@echo "  make status      Show status"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  FRONTEND"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make gen-routes  Regenerate routeTree.gen.ts"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  INFO"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make links       Show URLs"
	@echo "  make help        Show this help"

.PHONY: up down pre-build build logs status gen-routes links help
