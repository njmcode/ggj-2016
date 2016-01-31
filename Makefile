IMAGE=digimancer
TAG=0.1

run:
	docker-compose up

docker_build:
	docker run -ti --rm -v $(PWD)/src:/src -w /src/client node:5.2.0 make build
	docker build -t $(IMAGE) .

push: docker_build
	docker tag -f $(IMAGE) gcr.io/rehab-labs/$(IMAGE):$(TAG)
	gcloud docker push gcr.io/rehab-labs/$(IMAGE):$(TAG)

deploy: push
	-kubectl delete service $(IMAGE)
	-kubectl delete rc $(IMAGE)
	kubectl run $(IMAGE) --image=gcr.io/rehab-labs/$(IMAGE):$(TAG) --port=5000
	kubectl expose rc $(IMAGE) --type="LoadBalancer"