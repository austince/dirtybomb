/**
 * Created by austin on 6/15/16.
 */
"use strict";
import chai from 'chai';

import Atmosphere from '../src/Dispersion/Atmosphere';

chai.should();

describe('Atmospheric representation', function() {
    let atm;
    
    it('Basic construction', () => {
        atm = new Atmosphere(5, .5, 40, 300, 'rural', true);
    }) ;
    
    it('should print a human readable sentence', () => {
        console.log('' + atm);
    })
});