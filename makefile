all: hello

hello:
	echo 'Run make build or make watch'

watch:
	#watchman watch $(shell pwd)
	watchman -- trigger $(shell pwd) remake *.js *.css -- make

build:
	if [ ! -d "./build" ]; then mkdir ./build; fi

clean:
	rm -rf build
