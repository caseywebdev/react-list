BIN=node_modules/.bin/
COGS=$(BIN)cogs
.DEFAULT_GOAL := build

install: package.json
	npm install

build: install
	$(COGS)

dev: install
	$(COGS) -w docs/index.es6 -w react-list.es6
