project = test-webapp2-143703
name = test-webapp2
CONTINAER = test-webapp2
ts := $(shell /bin/date "+%Y%m%d-%H%M")


default: build

build:
	docker build -t $(name) .

run:
	docker run -it -p 8080:8080 --rm --name $(name) $(name)

kill:
	docker kill $(name) $(name)

login:
	docker exec -it $(name) bash

tag:
	echo "Tag = " $(ts)
	docker tag $(name) asia.gcr.io/$(project)/$(name):$(ts)
	gcloud docker push asia.gcr.io/$(project)/$(name):$(ts)

check_tag:
ifndef TAG
	$(error TAG is undefined)
endif

push: check_tag
	gcloud docker push asia.gcr.io/$(project)/$(name):$(TAG)

deploy:
	kubectl replace -f deployment.yaml
