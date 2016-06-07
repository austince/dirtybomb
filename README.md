# dirtybomb
Stevens Summer Scholars Research Project under [Dr. Alex Wellerstein](http://blog.nuclearsecrecy.com/).
The research aims to create a client-side library to model the impact of a dirty bomb. 

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
- Requires node / gulp / babel / all that jazz <-- These are not working yet
- Run using npm: `npm run build`  

## Testing
Using karma and jasmine  
Must be built before running tests as this is written in ecmaScript6 (the future)  

## Resources
[1]: https://goo.gl/ZqFHiE
[2]: http://www.src.com/