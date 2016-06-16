/**
 * Created by austin on 6/15/16.
 */
import chai from 'chai';

const dirtybomb = require('../dist/Dirtybomb');

chai.should();

describe('Simple Dirty bomb', function() {
    it('should import correctly', () => {
        let atm = new dirtybomb.Atmosphere(10, 1, 65, 300);
    });
});