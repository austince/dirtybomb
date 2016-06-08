#!/usr/bin/env bash

# Gulp / rollup / babel combo was super annoying


rollup -f umd -n Dirtybomb -o build/Dirtybomb.js -- index.js
babel build -d dist
# Can't figure out how babel works. Really butt hurt.
#rm -rf build