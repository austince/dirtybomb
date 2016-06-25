/**
 * Created by austin on 6/8/16.
 */
"use strict";

import chai from 'chai';

import Atmosphere from '../src/Dispersion/Atmosphere';
import Source, {
    SourceType
} from '../src/Dispersion/Source';
import GaussianPlume from '../src/Dispersion/GaussianPlume';

chai.should();

describe('GaussianPlume', function() {
    let plume;
    
    it('should import correctly', () => {
        const atm = new Atmosphere(10, 1, 65, 300);
        const source = new Source(SourceType.POINT, 2, 150, 5, 400, 4);
        plume = new GaussianPlume(atm, source); 
    });
    
    it('should have 0 stdY and stdZ at source', () => {
        plume.getStdY(0).should.be.closeTo(0, 0.1);
        plume.getStdZ(0).should.be.closeTo(0, 0.1);
    });

    it('should calculate proper effective heights', () => {

    });

    describe('Concentration functions', () => {
        it('should use ground level as default', () => {
            plume.getConcentration(100, 100).should.be.equal(
                plume.getConcentration(100, 100, 0)
            );

            plume.getConcentration(100, 100, 100).should.not.be.equal(
                plume.getConcentration(100, 100)
            )
        });
        
        it('should be 0 for all 0 x', () => {
           for (let y = -10000; y < 10000; y += 500) {
               plume.getConcentration(0, y).should.be.equal(0);
           } 
        });
    });
});