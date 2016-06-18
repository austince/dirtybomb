/**
 * Created by austin on 6/15/16.
 */
"use strict";
import chai from 'chai';

const dirtybomb = require('../dist/Dirtybomb');

chai.should();

describe('Simple Dirty bomb', function() {
    let bomb;
    
    it('should import correctly', () => {
        let atm = new dirtybomb.Atmosphere(10, 1, 65, 300);
    });
   
});