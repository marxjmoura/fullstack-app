#!/bin/bash

set -e

git checkout master
git pull origin master

rm -rf dist

npm install
npm run build

if [[ `git branch --list gh-pages` ]] then
  git worktree remove ./gh-pages --force
  git branch -D gh-pages
fi

rm -rf ./gh-pages
git worktree add ./gh-pages gh-pages

cp -r ./dist/* ./gh-pages/
echo "fullstack.app" > ./gh-pages/CNAME

cd ./gh-pages

git add .
git commit -m "Publish"
git push -f origin gh-pages
