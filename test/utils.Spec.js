/**
 * Created by austin on 6/8/16.
 */
"use strict";
import {integrate} from '../src/GaussianPlume/utils';
import chai from 'chai';

let assert = chai.assert;
let expect = chai.expect;


chai.should();

describe('Integrate', () => {
    it('accurate within 1/1000', () => {
        integrate(0, 1, () => { return 1; }).should.be.closeTo(1, 0.001);
    });
    
    it('can take functions with arguments', () => {
       integrate(0, 1, (x) => { return x; }).should.be.closeTo(0.5, 0.001); 
    });
});