#!/bin/bash

set -e

git checkout master
git pull origin master
rm -rf dist
[[ -d "./gh-pages" ]] && git worktree remove ./gh-pages
[[ `git branch --list gh-pages` ]] && git branch -D gh-pages
git worktree add ./gh-pages gh-pages
npm install
npm run build
rm -rf ./gh-pages/*
cp -r ./dist/* ./gh-pages/
echo "fullstack.app" > ./gh-pages/CNAME
cd ./gh-pages
git commit -am "Publish"
git push -f origin gh-pages
