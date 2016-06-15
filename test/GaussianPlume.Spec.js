/**
 * Created by austin on 6/8/16.
 */
"use strict";

import chai from 'chai';

import Atmosphere from '../src/GaussianPlume/Atmosphere';
import Source, {
    SourceType
} from '../src/GaussianPlume/Source';
import GaussianPlume from '../src/GaussianPlume/GaussianPlume';

chai.should();

describe('Simple Gaussian Plume', function() {
    it('should import correctly', () => {
        let atm = new Atmosphere(10, 1, 65, 300);
        let source = new Source(SourceType.POINT, 2, 150, 5, 400, 4);
        let plume = new GaussianPlume(atm, source); 
    });
});