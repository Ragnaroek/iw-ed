run:
	npm run start

clean:
	rm -rf build/

build:
	npm run build

deploy: build
	npm run deploy