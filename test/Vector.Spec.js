/**
 * Created by austin on 6/15/16.
 */


"use strict";

import chai from 'chai';

import Vector from '../src/Dispersion/Vector';

chai.should();

describe('Basic Vector Tests', function() {

    it('should do basic calculations', () => {
        let x1 = new Vector(1, 0, 0);
        x1.dot(x1).should.be.closeTo(1, 0.01);
        x1.abs().should.be.closeTo(1, 0);
    });

    it('should do 2d calculations', () => {
        let x1 = new Vector(1, 1);
        x1.abs().should.be.closeTo(1.414, 0.01);
    })
});
