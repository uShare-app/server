#!/bin/sh
apidoc=`npm list -g | grep "apidoc"`
if [ -z "$apidoc" ]; then
	npm install apidoc -g
fi
apidoc -i ./ -e doc/ -e node_modules/ -o doc/
