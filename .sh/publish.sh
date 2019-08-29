#!/bin/bash

set -e

rm -rf dist
[[ `git worktree list | grep gh-pages` ]] && git worktree remove ./gh-pages --force
[[ `git branch --list gh-pages` ]] && git branch -D gh-pages
rm -rf ./gh-pages

git checkout master
git pull origin master

npm install
npm run build

git worktree add ./gh-pages gh-pages

cp -r ./dist/* ./gh-pages/
echo "fullstack.app" > ./gh-pages/CNAME

cd ./gh-pages

git add .
git commit -m "Publish"
git push -f origin gh-pages
