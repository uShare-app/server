#!/bin/sh
npm install apidoc -g
apidoc -i ./ -e doc/ -e node_modules/ -o doc/
