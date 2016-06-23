# dirtybomb 
[![Build Status][buildBadge]][travis] [![Doc Status][docsBadge]][esdocs]
[![npm][npmBadge]][npm] ![License][licenseBadge]  
Stevens Summer Scholars Research Project under [Dr. Alex Wellerstein](http://blog.nuclearsecrecy.com/).
The research aims to create a client-side library to model the impact of a dirty bomb.  
Written in ES6.  

__Use in browser:__ use the rolled up files in the build/ directory  
__Use in node:__ use the rolled up files in the dist/ directory. It has been babel-ed to es5  

## Updates / Current Research
Currently writing tests and then moving towards visualization.  

## Goals  
- Dispersion Model
- Radioactive release Model
- Visualization Prototype

## Building  
Loosely trying to base this on how d3 manages its modularity.  
Builds to build/ and dist/  
- Requires node / babel / all that jazz
- Run using npm: `npm run build`  


## Testing
test/  
Using chai and mocha  
- `npm test`

## Documentation
Using esdoc. You should be able to create some nice documentation yourself with an easy command!
- `npm run doc`
- `npm servedocs` to locally host them

## Resources
- [Understanding Radioactive Aerosols and Their Measurement][URAaTM]
- [CALPUFF Modeling System][calpuff]

[docsBadge]: https://doc.esdoc.org/github.com/austincawley/dirtybomb/badge.svg
[esdocs]: https://doc.esdoc.org/github.com/austincawley/dirtybomb/
[buildBadge]: https://travis-ci.org/austincawley/dirtybomb.svg?branch=master
[travis]: https://travis-ci.org/austincawley/dirtybomb
[licenseBadge]: https://img.shields.io/npm/l/dirtybomb.svg
<!--[license]: https://github.com/austincawley/dirtybomb/blob/master/LICENSE.md-->
[npmBadge]: https://img.shields.io/npm/v/dirtybomb.svg
[npm]: https://www.npmjs.com/package/dirtybomb
[URAaTM]: https://goo.gl/ZqFHiE
[calpuff]: http://www.src.com/
[3]: http://www.sciencedirect.com/science/article/pii/S0093641303000247
