BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	npm install
	npm run lint
	$(COGS) -w examples/index.es6,react-list.es6
