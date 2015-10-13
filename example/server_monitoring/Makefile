NAME := simplyrethinkdb
TAG  := 0.1

docker:
	docker build -t $(NAME):$(TAG) .

build: docker

interact:
	docker run -it $(NAME):$(TAG) /bin/bash -l
