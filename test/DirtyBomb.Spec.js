/**
 * Created by austin on 6/15/16.
 */
import chai from 'chai';

const dirtybomb = require('../dist/Dirtybomb');

chai.should();

describe('Simple Dirty bomb', function() {
    it('should import correctly', () => {
        let atm = new dirtybomb.Atmosphere(10, 1, 65, 300);
        let source = new dirtybomb.Source(dirtybomb.SourceType.POINT, 2, 150, 5, 400, 4);
        let plume = new dirtybomb.GaussianPlume(atm, source);
    });
});