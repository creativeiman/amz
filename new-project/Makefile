# Makefile for Next.js Project

.PHONY: help install dev build start lint clean add-component

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36mmake %-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies with pnpm
	pnpm install

dev: ## Start development server
	pnpm dev

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

