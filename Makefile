SHELL := /bin/bash
.DEFAULT_GOAL := help

DOCKER_COMPOSE = docker-compose -f docker-compose.dev.yml

include .env
include .env.local
export

.PHONY: build
build: 		## webpack build
	$(DOCKER_COMPOSE) run --rm webpack npm run build

.PHONY: serve
serve: 		## webpack serve
	$(DOCKER_COMPOSE) run --rm webpack npm run serve

.PHONY: prettier
prettier: 	## run prettier
	$(DOCKER_COMPOSE) run --rm webpack npm run prettier

.PHONY: runner
runner:		## start the github runner
	bin/compose -p ${COMPOSE_PROJECT_NAME}-runner -f docker-compose.runner.yml pull
	bin/compose -p ${COMPOSE_PROJECT_NAME}-runner -f docker-compose.runner.yml up -d

.PHONY: help
help:		## displays this help message
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
