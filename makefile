# Use pandoc
#
all: preview

hello:
	echo 'Run make preview or make watch'

watch:
	#watchman watch $(shell pwd)
	watchman -- trigger $(shell pwd) remake *.js *.css -- make

preview:
	./build

open:
	open output/preview.pdf

clean:
	rm -rf ./output
