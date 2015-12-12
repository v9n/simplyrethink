OWNER := simplyrethinkdb
NAME := monitor
TAG  := 0.1.1

docker:
	docker build -t $(OWNER)/$(NAME):$(TAG) .

push:
	docker push $(OWNER)/$(NAME):$(TAG)

build: docker

interact:
	docker run -it $(OWNER)/$(NAME):$(TAG) /bin/bash -l

run:
	docker run --rm -it -v `pwd`/data:/data/rethinkdb -v `pwd`/log:/var/log/monitor -p 8080:8080 $(OWNER)/$(NAME):$(TAG)
