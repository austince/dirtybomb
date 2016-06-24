/**
 * Created by austin on 6/15/16.
 */
import chai from 'chai';

import Bomb from '../src/Bomb';

"use strict";

chai.should();

describe('Bomb', function() {
    let bomb;
    
    it('should import correctly', () => {
        bomb = new Bomb(22); // Fat Man
    });

    it('should create all properties', () => {
        bomb.mass.should.be.equal(22);
        bomb.weaponYield.should.be.equal(22 / 1000000);
    });
    
    describe('Cloud Methods', () => {
        it('should do cloud calculations', () => {
            bomb.cloudHeight.should.be.above(0);
            bomb.cloudRadius.should.be.above(0);
        });
    });
    
    describe('Static', () => {
        it('should calculate tntEquivalence', () => {
           Bomb.tntEquivalent(4.184, 1).should.be.equal(1); 
        });
        
        it('should have a standard Atmosphere object', () => {
            Bomb.STANDARD_ATM.temperature.should.be.equal(288.2);
        })
    });
});