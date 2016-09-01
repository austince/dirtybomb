/**
 * Created by austin on 6/15/16.
 */

import chai from 'chai';

import Atmosphere from '../src/Dispersion/Atmosphere';
import Source, {
    SourceType
} from '../src/Dispersion/Source';
import GaussianPuff from '../src/Dispersion/GaussianPuff';
import {integrate} from '../src/Dispersion/utils';

chai.should();

describe('GaussianPuff', function() {
    let puff;
    
    describe('Constructor', () => {
        it('should import correctly', () => {
            const atm = new Atmosphere(10, 1, 65, 300);
            const source = new Source(SourceType.POINT, 2, 150, 5, 400, 4);
            puff = new GaussianPuff(atm, source, 20);
        });
    });
    
    describe('CenterX functions', () => {
        it('should have a center at 0,0,0 before release', () => {
            puff.getCenterX(0).should.be.equal(0);
        });
        
        it('should move in the x direction with constant wind', () => {
           puff.getCenterX(3600).should.be.above(0); 
        });
        
        it('should move at the rate of the wind', () => {
            console.log(puff.windSpeedAtSourceHeight);
           puff.getCenterX(3600).should.be.closeTo(3600 * puff.windSpeedAtSourceHeight, 0.01)
        });
    });
    
    describe('Concentration functions', () => {
        it('should have 0 concentration before release', () => {
            puff.getConcentration(0, 0, 0, 0).should.be.equal(0);
            puff.getConcentration(0, 0, 0, 10).should.be.above(0);
        });

        it('should be 0 for all 0 x', () => {
            for (let y = -10000; y < 10000; y += 500) {
                puff.getConcentration(0, y).should.be.equal(0);
            }
        });
    });
});