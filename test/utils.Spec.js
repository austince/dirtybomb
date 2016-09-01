/**
 * Created by austin on 6/8/16.
 */
import {integrate} from '../src/Dispersion/utils';
import chai from 'chai';

chai.should();

describe('Integrate', function() {
    it('accurate within 1/1000 for simple functions', () => {
        integrate(0, 1, () => { return 1; }).should.be.closeTo(1, 0.001);
    });
    
    it('can take functions with arguments', () => {
       integrate(0, 1, (x) => { return x; }).should.be.closeTo(0.5, 0.001); 
    });

    it('does slightly more complex functions with increased accuracy', () => {
       integrate(2, 3, (x) => { return .25 * Math.pow(x, 3); }, 0.0001)
           .should.be.closeTo(4.0625, 0.001);
    });
});