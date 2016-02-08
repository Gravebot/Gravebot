echo "Checking if we should be building new Docker image"
if [ "$TRAVIS_BRANCH" == "master" ] && [ -n "$DOCKER_EMAIL" ]
then
  docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASS"
  export REPO=gravebot/gravebot
  docker build --build-arg NODE_VERSION=$(cat package.json | json engines.node) --build-arg NPM_VERSION=$(cat package.json | json engines.npm) -f Dockerfile -t $REPO:$COMMIT .
  docker tag -f $REPO:$COMMIT $REPO:latest
  docker push $REPO
else
  echo "Not master branch, skipping docker build"
fi
