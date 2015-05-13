BIN=node_modules/.bin/
BOWER=$(BIN)bower
COGS=$(BIN)cogs

dev:
	npm install
	$(BOWER) install
	$(COGS) -w index.es6,react-list.es6
