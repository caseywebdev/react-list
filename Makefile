BIN=node_modules/.bin/
COGS=$(BIN)cogs
.DEFAULT_GOAL := build

package-lock.json: package.json
	npm install --package-lock-only --save

node_modules: package-lock.json
	npm install

lint: node_modules
	$(BIN)eslint src/react-list.js

build: node_modules lint
	$(COGS)

dev: node_modules lint
	$(COGS) -w src/docs/index.js -w src/react-list.js -w react-list.js
