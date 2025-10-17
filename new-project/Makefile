# Makefile for Next.js Project

.PHONY: help install dev build start lint clean add-component

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36mmake %-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies with pnpm
	pnpm install

dev: ## Start development server
	pnpm dev

worker: ## Start background worker for job queue
	pnpm worker

worker-dev: ## Start background worker with auto-reload
	pnpm worker:dev

build: ## Build for production
	pnpm build

start: ## Start production server
	pnpm start

lint: ## Run ESLint
	pnpm lint

clean: ## Clean node_modules and build files
	rm -rf node_modules .next

add-component: ## Add shadcn component (usage: make add-component COMPONENT=button)
	pnpm dlx shadcn@latest add $(COMPONENT) -y

format: ## Format code with prettier
	pnpm prettier --write .

test: ## Run tests
	pnpm test

test-ai: ## Test AI label analysis (usage: make test-ai [IMAGE=path] [CATEGORY=type] [MARKETS=list])
	@cd new-project && pnpm tsx scripts/test-ai-analysis.ts $(IMAGE) $(CATEGORY) $(MARKETS)

# Docker commands
docker-up: ## Start PostgreSQL with Docker
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f postgres

docker-clean: ## Remove Docker containers and volumes
	docker-compose down -v

# Redis & Queue commands
redis-start: ## Start Redis for job queue
	docker-compose -f docker-compose.queue.yml up -d redis

redis-stop: ## Stop Redis
	docker-compose -f docker-compose.queue.yml stop redis

redis-logs: ## View Redis logs
	docker logs -f amz-redis

redis-cli: ## Open Redis CLI
	docker exec amz-redis redis-cli

queue-stats: ## Check queue statistics
	docker exec amz-redis redis-cli LLEN bull:label-scan:waiting
	docker exec amz-redis redis-cli LLEN bull:label-scan:active
	docker exec amz-redis redis-cli LLEN bull:label-scan:completed

# MinIO (Object Storage)
minio-start: ## Start MinIO for file storage
	docker-compose -f docker-compose.queue.yml up -d minio
	@echo "✅ MinIO started!"
	@echo "📦 MinIO Console: http://localhost:9001"
	@echo "🔑 Login: minioadmin / minioadmin123"

minio-stop: ## Stop MinIO
	docker-compose -f docker-compose.queue.yml stop minio

minio-logs: ## View MinIO logs
	docker logs -f amz-minio

minio-restart: ## Restart MinIO
	docker-compose -f docker-compose.queue.yml restart minio

# Database commands
db-generate: ## Generate Prisma client
	pnpm prisma generate

db-migrate: ## Create and run migration
	pnpm prisma migrate dev

db-deploy: ## Deploy migrations to production
	pnpm prisma migrate deploy

db-studio: ## Open Prisma Studio
	pnpm prisma studio

db-seed: ## Seed database
	pnpm prisma db seed

db-push: ## Push schema changes to DB (dev only)
	pnpm prisma db push

db-reset: ## Reset database (dev only)
	pnpm prisma migrate reset

db-status: ## Check migration status
	pnpm prisma migrate status

# Complete setup
setup: docker-up ## Complete setup: Start DB + Install + Generate Prisma
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	pnpm install
	pnpm prisma generate
	pnpm prisma migrate dev --name init
	@echo "✅ Setup complete! Run 'make dev' to start the app"

# Fresh development setup (destroys existing data!)
dev-setup: ## Fresh setup: Delete DB, recreate, migrate & seed
	@bash scripts/dev-setup.sh

# Complete development environment
dev-all: ## Start everything: Redis + MinIO + PostgreSQL + App + Worker (in background)
	@echo "🚀 Starting complete development environment..."
	@make redis-start
	@make minio-start
	@make docker-up
	@sleep 2
	@echo "✅ Redis, MinIO, and PostgreSQL started"
	@echo ""
	@echo "📝 Services:"
	@echo "  PostgreSQL: localhost:5433"
	@echo "  Redis: localhost:6379"
	@echo "  MinIO API: localhost:9000"
	@echo "  MinIO Console: http://localhost:9001 (minioadmin / minioadmin123)"
	@echo ""
	@echo "📝 To start the app and worker, run in separate terminals:"
	@echo "  Terminal 1: make dev"
	@echo "  Terminal 2: make worker"
	@echo ""
	@echo "Or use tmux/screen to run them in background"

