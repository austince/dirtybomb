/**
 * Created by austin on 6/15/16.
 */
import chai from 'chai';

import Bomb from '../src/Bomb';
const dirtybomb = require('../dist/Dirtybomb');

"use strict";

chai.should();

describe('Simple Dirty bomb', function() {
    let bomb;

    it('should import correctly', () => {
        bomb = new Bomb(50);
    });

    it('should create all properties', () => {
        bomb.mass.should.be.equal(50);
        bomb.weaponYield.should.be.equal(50 / 1000000);
    });
    
    it('should do cloud calculations', () => {
        bomb.cloudHeight.should.be.above(0);
        bomb.cloudRadius.should.be.above(0);
        console.log(bomb.cloudHeight);
        console.log(bomb.cloudRadius);
    });
});