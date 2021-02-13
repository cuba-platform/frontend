#!/bin/sh

REPO_URL=https://${GH_TOKEN}@github.com/cuba-labs/frontend-scr-builds.git
BRANCH=master

echo "Cloning frontend-scr-builds"
git clone $REPO_URL --branch=$BRANCH > /dev/null 2>&1
cd frontend-scr-builds || exit
git remote set-url origin $REPO_URL > /dev/null 2>&1

echo "Copying the built clients"
cp -r ../example-react-app .
cp -r ../react-native-client-scr .

echo "Committing"
git config user.name "Travis CI"
git config user.email "<>"
git add -A
git commit -m "Build $TRAVIS_BUILD_NUMBER"

echo "Pushing"
git push --quiet --set-upstream origin $BRANCH