SHELL := /bin/bash
.DEFAULT_GOAL := help

include .env

DOCKER_COMPOSE = bin/compose -f docker-compose.base.yml -f docker-compose.dev.yml

.PHONY: build
build: 		## buid services
	$(DOCKER_COMPOSE) build

.PHONY: up
up: 		## deploy services
	$(DOCKER_COMPOSE) up -d --remove-orphans

.PHONY: serve
serve: 		## deploy services
	$(DOCKER_COMPOSE) run --rm webpack npm run serve

.PHONY: stop
stop: 		## stop services
	$(DOCKER_COMPOSE) stop

.PHONY: restart
restart: 	## restart services
	$(DOCKER_COMPOSE) restart

.PHONY: assets-hash
assets-hash: ## compute assets hash
	$(DOCKER_COMPOSE) run --rm app php assetsHash.php > .assetsHash

.PHONY: shell
shell: up	## login to the app container
	$(DOCKER_COMPOSE) exec app bash

.PHONY: runner
runner:		## start the github runner
	bin/compose -p ${COMPOSE_PROJECT_NAME}-runner -f docker-compose.runner.yml pull
	bin/compose -p ${COMPOSE_PROJECT_NAME}-runner -f docker-compose.runner.yml up -d

.PHONY: help
help:		## displays this help message
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
