#!/bin/bash

rm -rf dist
npm install
npm run build
git checkout --orphan gh-pages
ls -A | grep -v ".git\|dist" | xargs rm -rf
cp -r dist/* .
echo "fullstack.app" > CNAME
git add .
git commit -m "Publish"
git push -f origin gh-pages
