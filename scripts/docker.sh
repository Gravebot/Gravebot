if [ "$TRAVIS_BRANCH" == "master" ]
then
  docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASS"
  export REPO=gravebot/gravebot
  docker build -f Dockerfile -t $REPO:$COMMIT .
  docker tag -f $REPO:$COMMIT $REPO:latest
  docker tag $REPO:$COMMIT $REPO:travis-$TRAVIS_BUILD_NUMBER
  docker push $REPO
else
  echo "Not master branch, skipping docker build"
fi
