/**
 * Created by austin on 6/16/16.
 */

/**
 *
  */
class NuclearMaterial {

    /**
     *
     * @param {number|string} halfLifeOrPreset - either
     * @param {number} molarMass - 
     * @param {number} mass - Total mass of substance 
     */
    constructor(halfLifeOrPreset, molarMass, mass) {
        if (typeof halfLifeOrPreset === 'number') {
            this._halfLife = halfLifeOrPreset;
        } else {
            this._halfLife = 0; // Map to known substances
        }
        /**
         * 
         * @type {number}
         * @private
         */
        this._molarMass = molarMass;
        /**
         * 
         * @type {number}
         * @private
         */
        this._mass = mass;
    }

    get halfLife() {
        return this._halfLife;
    }

}

export default NuclearMaterial;