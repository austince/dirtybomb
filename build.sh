#!/usr/bin/env bash

# Gulp / rollup / babel combo was super annoying


node_modules/.bin/rollup -f umd -n Dirtybomb -o build/Dirtybomb.js -- index.js
node_modules/.bin/babel build -d dist
# Can't figure out how babel works. Really butt hurt.
#rm -rf build