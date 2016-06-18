/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */

import Dispersion from './Dispersion/Dispersion';
import Bomb from './Bomb';

/**
 * A simple dirtybomb. Assumes all nuclear material is released into the atmosphere
 */
class Dirtybomb extends Bomb {
    constructor(nuclearMat, tntEqvMass, atmosphere = Bomb.STANDARD_ATM) {
        super(tntEqvMass, atmosphere);
        this._nucMat = nuclearMat;
        
        this._puff = new Dispersion.GaussianDecayPuff(
            atmosphere,
            this.source,
            this.mass,
            nuclearMat.halfLife
        );
    }
}


Dirtybomb.Atmosphere = Dispersion.Atmosphere;

export default Dirtybomb;