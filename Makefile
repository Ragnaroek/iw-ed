run:
	pnpm run start

clean:
	rm -rf build/

build:
	pnpm run build

deploy: build
	pnpm run deploy