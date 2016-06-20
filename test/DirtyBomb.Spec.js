/**
 * Created by austin on 6/15/16.
 */
"use strict";
import chai from 'chai';

const dirtybomb = require('../dist/Dirtybomb');

chai.should();

describe('DirtyBomb', function() {
    let bomb;
    describe('imports', () => {
        it('should import Atmosphere', () => {
            let atm = new dirtybomb.Atmosphere(10, 1, 65, 300);
        });
        
        it('should import NuclearMaterial', () => {
            let nucMat = new dirtybomb.NuclearMaterial(2767540000, 238, 100);
        })
    });
    
});