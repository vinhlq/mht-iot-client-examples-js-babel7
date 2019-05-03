#!/bin/sh

chmod 400 .github/vinhlq.github.pem
GIT_SSH_COMMAND='ssh -i .github/vinhlq.github.pem' git fetch --all
git reset --hard origin/master
