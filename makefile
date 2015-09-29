# Use pandoc and watchman
#
# We need https://github.com/jgm/pandoc/releases
# Download and install it
# Download http://www.tug.org/mactex/morepackages.html and install BasicTeX  for
# brew install watchman

all: preview

hello:
	echo 'Run make preview or make watch'

watch:
	watchman watch $(shell pwd)/manuscript
	watchman -- trigger $(shell pwd)/manuscript remake *.txt *.js *.css -- make preview

preview:
	if [ ! -d "./output" ]; then mkdir ./output; fi
	echo "" > "./output/source.markdown"
	for chapfile in $(shell cat manuscript/Book.txt); do cat manuscript/"$$chapfile" >> ./output/source.markdown; done
	cp -rf manuscript/images ./output/
	cd output && pandoc --smart --table-of-contents --output=./preview.pdf ./source.markdown

open:
	open output/preview.pdf

clean:
	rm -rf ./output
	watchman watch-del $(shell pwd)/manuscript
