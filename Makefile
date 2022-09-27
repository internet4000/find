build:
	rm -rf production
	mkdir production
	mv -r index.html 404.html *.js styles.css opensearch.xml public public/favicon.ico ./production
	mv production public
