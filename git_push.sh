#!/bin/sh

git add .
git commit -m "..."
GIT_SSH_COMMAND='ssh -i ssh.rsa.pem' git push origin master
