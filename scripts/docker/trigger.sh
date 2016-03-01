if [ "$TRAVIS_BRANCH" == "master" ]; then
  curl -H "Content-Type: application/json" --data '{"source_type": "Branch", "source_name": "master"}' -X POST https://registry.hub.docker.com/u/gravebot/gravebot/trigger/$DOCKER_TOKEN/;
fi
