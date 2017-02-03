#!/bin/sh

# PREPARE
rm -rf ./dest;
# RUN
./node_modules/.bin/tsc -w --pretty &
./node_modules/.bin/onchange 'js/**/*' -- yarn test
wait
