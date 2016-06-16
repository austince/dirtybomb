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
    it('should import correctly', () => {
        let atm = new Atmosphere(10, 1, 65, 300);
        let source = new Source(SourceType.POINT, 2, 150, 5, 400, 4);
        let puff = new GaussianPuff(atm, source, 20);
    });
});