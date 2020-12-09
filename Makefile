build: build-env build-find
build-env:
	rm -rf production
	mkdir production
build-find:
	cp -r index.html 404.html main.js styles.css opensearch.xml public public/favicon.ico ./production
