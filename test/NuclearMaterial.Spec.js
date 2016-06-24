/**
 * Created by austin on 6/20/16.
 */

"use strict";

import chai from 'chai';
const db = require('../dist/Dirtybomb');

const expect = chai.expect;
chai.should();

describe('NuclearMaterial', function() {
    let pu238, cobalt60;
    describe('Constructor', () => {
        it('should construct from half life', () => {
            pu238 = new db.NuclearMaterial(2767540000, 238, 100);
        });
        
        it('should construct from preset', () => {
            cobalt60 = new db.NuclearMaterial("Cobalt", 60, 100);
        });
        
        it('should throw error if preset is not found', () => {
            let badConstruction = function() {
                return new db.NuclearMaterial("WMD", 2001, 100);
            };
            expect(badConstruction).to.throw(Error, /no preset/);
        });
    });
    
    describe('Getters', () => {
        it('should return sample mass', () => {
            pu238.mass.should.be.equal(100);
            cobalt60.mass.should.be.equal(100);
        });
        
        it('should return atomic mass', () => {
            pu238.atomicMass.should.be.equal(238);
            cobalt60.atomicMass.should.be.equal(60);
        });
        
        it('should return half life', () => {
            pu238.halfLife.should.be.equal(2767540000);
            cobalt60.halfLife.should.be.equal(166349000);
        });
        
        it('should return decayMode if provided', () => {
            pu238.decayMode.should.be.equal('');
            cobalt60.decayMode.should.be.equal('beta,gamma,gamma');
        });
    })
});