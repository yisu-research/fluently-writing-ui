IMAGE_TAG=registry.cn-hangzhou.aliyuncs.com/social-sensor/fluently-writing-web-test:latest
docker build . --platform linux/amd64 -t $IMAGE_TAG
docker push $IMAGE_TAG
