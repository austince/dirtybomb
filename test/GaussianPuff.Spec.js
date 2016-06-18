/**
 * Created by austin on 6/15/16.
 */

"use strict";

import chai from 'chai';

import Atmosphere from '../src/Dispersion/Atmosphere';
import Source, {
    SourceType
} from '../src/Dispersion/Source';
import GaussianPuff from '../src/Dispersion/GaussianPuff';

chai.should();

describe('Simple Gaussian Plume', function() {
    let puff;

    it('should import correctly', () => {
        let atm = new Atmosphere(10, 1, 65, 300);
        let source = new Source(SourceType.POINT, 2, 150, 5, 400, 4);
        puff = new GaussianPuff(atm, source, 20);
    });

    it('should have a center at 0,0,0 before release', () => {
       puff.getCenterX(0).should.be.equal(0); 
    });
   /*
    it('should have 0 concentration before release', () => {
       puff.getConcentration(0, 0, 0, 0).should.be.equal(0);
    });*/
});