BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	npm install
	bower install
	$(COGS) -w react-list.es6
