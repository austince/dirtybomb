/**
 * Created by austin on 6/15/16.
 */
"use strict";
import chai from 'chai';
import Atmosphere from '../src/Dispersion/Atmosphere';

const expect = chai.expect;
chai.should();

describe('Atmosphere', function() {
    let atm;
    
    describe('Constructor', () => {
        it('should take basic and optional parameters', () => {
            atm = new Atmosphere(5, .5, 40, 300, 'rural', true);
        }) ;

    });
    
    describe('Wind methods', () => {
       it('should calculate abs from 2d wind direction', () => {
           atm.setWindSpeed([10, 0]);
           let atm2 = new Atmosphere(10, .5, 40, 300, 'rural', true);
           atm.getWindSpeed().should.be.equal(atm2.getWindSpeed());
           
           atm.getWindSpeed().should.be.equal(10);
       });
    });
    
    it('should print a human readable sentence', () => {
        atm = new Atmosphere(5, .5, 40, 300, 'rural', true);
        let readable = '' + atm;
        expect(readable).to.have.string('Grade');
    })
});