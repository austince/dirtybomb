# dirtybomb
Stevens Summer Scholars Research Project under [Dr. Alex Wellerstein](http://blog.nuclearsecrecy.com/).
The research aims to create a client-side library to model the impact of a dirty bomb.  
Written in ES6.  

__Use in browser:__ use the rolled up files in the build/ directory  
__Use in node:__ use the rolled up files in the dist/ directory. It has been babel-ed to es5  

## Updates / Current Research
The plume model is working fine for steady-state plumes. Will now be branching out towards alternatives 
that try to account for changing atmospheres. A typical method is puffs, where the plume is broken up into
small segments.  
[Page 287][1] has some good stuff.  

Puff Models:  
- [CALPUFF][2]

## Goals  
- Dispersion Model
- Radioactive release Model
- Visualization Prototype

## Building  
Loosely trying to base this on how d3 manages its modularity.  
- Requires node / babel / all that jazz
- Run using npm: `npm run build`  

## Testing
Using chai and mocha  
- `npm run test`

## Documentation
Using esdoc. You should be able to create some nice documentation yourself with an easy command!
- `npm run doc`

## Resources
[1]: https://goo.gl/ZqFHiE
[2]: http://www.src.com/
[3]: http://www.sciencedirect.com/science/article/pii/S0093641303000247