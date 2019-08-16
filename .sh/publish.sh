#!/bin/bash

set -e

rm -rf dist
git checkout master
git pull origin master
npm install
npm run build
git checkout --orphan gh-pages
ls -A | grep -v ".git\|dist" | xargs rm -rf
cp -r dist/* .
echo "fullstack.app" > CNAME
git add .
git commit -m "Publish"
git push -f origin gh-pages
git branch -D gh-pages
git checkout master
npm install
