BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	npm install
	$(COGS) -w docs/index.es6 -w react-list.es6
