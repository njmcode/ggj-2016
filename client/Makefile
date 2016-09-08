install:
	npm set progress=false
	npm install

build: install
	node_modules/.bin/webpack -d

watch: install
	node_modules/.bin/webpack -d -w --progress --colors
