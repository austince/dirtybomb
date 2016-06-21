/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */

import GaussianDecayPuff from './Dispersion/GaussianDecayPuff';
import DynamicGaussianDecayPuff from './Dispersion/DynamicGaussianDecayPuff';
import Bomb from './Bomb';
import NuclearMaterial from './NuclearMaterial';
import Dispersion from './Dispersion/Dispersion';

/**
 * A simple dirtybomb. Assumes all nuclear material is released into the atmosphere
 */
class Dirtybomb extends Bomb {

    /**
     * @param {NuclearMaterial} nuclearMat
     * @param {number} tntEqvMass - Standardized TNT equivalent kilotons (kt)
     * @param {Atmosphere} [atmosphere=Bomb.STANDARD_ATM]
     * @param {boolean} [isStatic=true] - Determines the type of puff that is used
     * 
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
            this._puff = new GaussianDecayPuff(
                atmosphere,
                this.source,
                nuclearMat.mass,
                nuclearMat.halfLife
            );
        } else {
            this._puff = new DynamicGaussianDecayPuff(
                atmosphere,
                this.source,
                nuclearMat.mass,
                nuclearMat.halfLife
            )
        }
    }
}

export {Dispersion};
export {NuclearMaterial};
export default Dirtybomb;