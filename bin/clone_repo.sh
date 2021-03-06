#!/bin/bash

export REPO=https://github.com/ruslankhh/yandex-shri-2018-homework-4-5-6
export REPO_DIR=repo

rm -rf ${REPO_DIR}
git clone ${REPO} ${REPO_DIR}
cd ${REPO_DIR}

for branch in `git branch -a | grep remotes | grep -v HEAD | grep -v master `; do
   git branch --track ${branch#remotes/origin/} $branch
done

cd ..
