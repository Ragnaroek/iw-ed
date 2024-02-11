run:
	pnpm run start

clean:
	rm -rf build/

build:
	pnpm run build

deploy: clean build
	pnpm run deploy