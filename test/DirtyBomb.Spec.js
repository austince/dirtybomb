/**
 * Created by austin on 6/15/16.
 */
"use strict";
import chai from 'chai';

const db = require('../dist/Dirtybomb');


chai.should();

describe('DirtyBomb', function() {
    let bomb;
    describe('Imports', () => {
        it('should import Atmosphere', () => {
            let atm = new db.Dispersion.Atmosphere(10, 1, 65, 300);
        });
        
        it('should import NuclearMaterial', () => {
            let nucMat = new db.NuclearMaterial(2767540000, 238, 100);
        });
    });

    describe('Constructor', () => {
        let nucMat = new db.NuclearMaterial("Cobalt", 60, 100);
        let atm = new db.Dispersion.Atmosphere([2, 3], .5, 65, 288);
        
        it('should construct from defaults', () => {
            let bomb = new db.Dirtybomb(nucMat);
        });
        
        it('should construct with non-default atmosphere', () => {
            let bomb = new db.Dirtybomb(nucMat, 20, atm);
        });
        
        it('should construct with a dynamic plume', () => {
            let bomb = new db.Dirtybomb(nucMat, 20, atm, false);
            // Dynamic
            bomb.dispersion.path.length.should.be.equal(0);
            bomb.mass.should.be.equal(20);
        });
    });
    
    
    
});