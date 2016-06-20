/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */

import Dispersion from './Dispersion/Dispersion';
import Bomb from './Bomb';
import NuclearMaterial from './NuclearMaterial';

/**
 * A simple dirtybomb. Assumes all nuclear material is released into the atmosphere
 */
class Dirtybomb extends Bomb {

    /**
     * @param {NuclearMaterial} nuclearMat
     * @param {number} tntEqvMass
     * @param {Atmosphere} [atmosphere=Bomb.STANDARD_ATM]
     * @param {boolean} [isStatic=true] - Determines the type of puff that is used
     */
    constructor(nuclearMat, tntEqvMass, atmosphere = Bomb.STANDARD_ATM, isStatic = true) {
        super(tntEqvMass, atmosphere, isStatic);
        
        /**
         * @type {NuclearMaterial}
         * @private
         */
        this._nucMat = nuclearMat;

        /**
         * Either
         * @type {GaussianPuff}
         * @private
         */
        this._puff;
        
        if (isStatic) {
            this._puff = new Dispersion.GaussianDecayPuff(
                atmosphere,
                this.source,
                nuclearMat.mass,
                nuclearMat.halfLife
            );
        } else {
            this._puff = new Dispersion.DynamicGaussianDecayPuff(
                atmosphere,
                this.source,
                nuclearMat.mass,
                nuclearMat.halfLife
            )
        }
    }
}


Dirtybomb.Atmosphere = Dispersion.Atmosphere;
Dirtybomb.NuclearMaterial = NuclearMaterial;

export default Dirtybomb;