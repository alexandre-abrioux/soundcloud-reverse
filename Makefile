SHELL := /bin/bash
.DEFAULT_GOAL := help

include .env

.PHONY: build
build: 		## buid services
	bin/compose build

.PHONY: up
up: 		## deploy services
	bin/compose up -d --remove-orphans

.PHONY: serve
serve: 		## deploy services
	bin/compose run --rm webpack npm run serve

.PHONY: stop
stop: 		## stop services
	bin/compose stop

.PHONY: restart
restart: 	## restart services
	bin/compose restart

.PHONY: assets-hash
assets-hash: ## compute assets hash
	bin/compose run --rm app php assetsHash.php > .assetsHash

.PHONY: shell
shell: up	## login to the app container
	bin/compose exec app bash

.PHONY: help
help:		## displays this help message
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
