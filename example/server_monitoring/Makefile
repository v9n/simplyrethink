OWNER := simplyrethinkdb
NAME := monitor
TAG  := 0.1

docker:
	docker build -t $(OWNER)/$(NAME):$(TAG) .

push:
	docker push -t $(OWNER)/$(NAME):$(TAG)

build: docker

interact:
	docker run -it $(NAME):$(TAG) /bin/bash -l
