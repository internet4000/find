build: build-env build-find build-find-settings
build-env:
	rm -rf production
	mkdir production
build-find:
	cp -r index.html 404.html main.js styles.css opensearch.xml public  ./production
build-find-settings:
	cd ./settings && yarn build
	mv ./settings/build ./production/settings
