BIN=node_modules/.bin/
COGS=$(BIN)cogs
.DEFAULT_GOAL := build

package-lock.json: package.json
	npm install --package-lock-only

node_modules: package-lock.json
	npm install

build: node_modules
	$(COGS)

dev: node_modules
	$(COGS) -w docs/index.es6 -w react-list.es6 -w react-list.js
