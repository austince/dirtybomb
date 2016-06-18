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
     * @param {number} mass - Total mass of substance
     * @param {number} [molarMass] 
     */
    constructor(halfLifeOrPreset, mass, molarMass) {
        if (typeof halfLifeOrPreset === 'number') {
            this._halfLife = halfLifeOrPreset;
        } else {
            this._halfLife = 0; // Map to known substances
        }
        
        /**
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
    
    get mass() {
        return this._mass;
    }

    get molarMass() {
        return this._molarMass;
    }
    
    get halfLife() {
        return this._halfLife;
    }
}

export default NuclearMaterial;