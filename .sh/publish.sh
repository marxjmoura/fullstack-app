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
cd ./gh-pages
ls -A | grep -v ".git$\|dist" | xargs rm -rf
cp -r dist/* .
echo "fullstack.app" > CNAME
git add --all
git commit -m "Publish"
git push -f origin gh-pages
