# Makefile for InterviewWhiz

# Variables
DOCKER_COMPOSE = docker compose
PROJECT_NAME = interviewwhiz

.PHONY: help run-project run stop restart build logs clean ps backend-logs frontend-logs db-shell

help:
	@echo "Available commands:"
	@echo "  run-project     - Start all services in detached mode (alias for run)"
	@echo "  run             - Start all services in detached mode"
	@echo "  stop            - Stop and remove all service containers"
	@echo "  restart         - Restart all services"
	@echo "  build           - Build or rebuild services"
	@echo "  rebuild         - Full rebuild (build + stop + run)"
	@echo "  logs            - View output from containers"
	@echo "  ps              - List containers"
	@echo "  clean           - Stop and remove containers, networks, and images"
	@echo "  clean-v         - Stop and remove containers, networks, images, and volumes"
	@echo "  backend-logs    - View logs for the backend service"
	@echo "  frontend-logs   - View logs for the frontend service"
	@echo "  db-shell        - Open a PostgreSQL shell"

run-project: run

run:
	$(DOCKER_COMPOSE) up -d

stop:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) restart

build:
	$(DOCKER_COMPOSE) build

rebuild:
	$(DOCKER_COMPOSE) build
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	$(DOCKER_COMPOSE) ps

clean:
	$(DOCKER_COMPOSE) down --rmi all

clean-v:
	$(DOCKER_COMPOSE) down -v --rmi all

backend-logs:
	$(DOCKER_COMPOSE) logs -f backend

frontend-logs:
	$(DOCKER_COMPOSE) logs -f frontend

db-shell:
	$(DOCKER_COMPOSE) exec postgres psql -U postgres -d interviewwhiz
