build: build-env-site build-find-site
build-env-site:
	rm -rf production
	mkdir production
build-find-site:
	cp -r index.html 404.html *.js styles.css opensearch.xml public public/favicon.ico ./production
