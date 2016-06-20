/**
 * Created by austin on 6/16/16.
 */

/**
 * 
 * @type {*[]}
 */
const ISOTOPES = [
    {name: "Cobalt", element: "Co", mass: 60, halfLife: 166349000, decayMode: "beta,gamma,gamma"},
    {name: "Strontium", element: "Sr", mass: 90, halfLife: 908839000, decayMode: "betaminus"},
    {name: "Iodine", element: "I", mass: 129, halfLife: 495444000000000, decayMode: "beta,gamma"},
    {name: "Caesium", element: "Cs", mass: 135, halfLife: 7.25328e+13, decayMode: "beta"},
    {name: "Caesium", element: "Cs", mass: 137, halfLife: 952072000, decayMode: "beta,gamma"},
    {name: "Polonium", element: "Po", mass: 210, halfLife: 11955700, decayMode: "alpha"},
    {name: "Radon", element: "Rn", mass: 222, halfLife: 330350, decayMode: "alpha"},
    {name: "Radium", element: "Ra", mass: 226, halfLife: 50491100000, decayMode: "alpha"},
    {name: "Thorium", element: "Th", mass: 232, halfLife: 443375000000000000, decayMode: "alpha"},
    {name: "Uranium", element: "U", mass: 233, halfLife: 5023860000000, decayMode: "alpha"},
    {name: "Uranium", element: "U", mass: 235, halfLife: 22209800000000000, decayMode: "alpha"},
    {name: "Uranium", element: "U", mass: 238, halfLife: 140996000000000000, decayMode: "alpha"},
    {name: "Plutonium", element: "Pu", mass: 238, halfLife: 2767540000, decayMode: "alpha"},
    {name: "Plutonium", element: "Pu", mass: 239, halfLife: 760837000000, decayMode: "alpha"},
    {name: "Plutonium", element: "Pu", mass: 240, halfLife: 207108000000, decayMode: "alpha"},
    {name: "Americium", element: "Am", mass: 241, halfLife: 13638900000, decayMode: "alpha"},
    {name: "Curium", element: "Cm", mass: 242, halfLife: 13824000, decayMode: "alpha"}
];


/**
 *
  */
class NuclearMaterial {

    /**
     *
     * @param {number|string} halfLifeOrName - either
     * @param {number} [atomicMass] - necessary with name if using preset (u)
     * @param {number} mass - Total mass of substance (g)
     * @param {string} [decayMode='']
     *
     * @example
     * // 100 grams of Cobalt-60
     * let cobalt60 = new NuclearMaterial("Cobalt", 60, 100);
     *
     * // 100 grams of Plutonium-238
     * let pu238 = new NuclearMaterial(2767540000, 238, 100);
     */
    constructor(halfLifeOrName, atomicMass, mass, decayMode = '') {
        if (typeof halfLifeOrName === 'number') {
            /**
             *
             * @type {number}
             * @private
             */
            this._halfLife = halfLifeOrName;

            /**
             * @type {number|*}
             * @private
             */
            this._atomicMass = atomicMass;

            /**
             * 
             * @type {string}
             * @private
             */
            this._decayMode = decayMode;

        } else {
            let isotopePreset;
            for (let i of ISOTOPES) {
                if (i.name === halfLifeOrName && i.mass == Math.round(atomicMass)) {
                    isotopePreset = i;
                    break;
                }
            }

            if (!isotopePreset) 
                throw new Error('There is no preset for ' + halfLifeOrName + '-'+ atomicMass);

            this._halfLife = isotopePreset.halfLife; // Map to known substances
            this._atomicMass = isotopePreset.mass;
            this._decayMode = isotopePreset.decayMode;
        }


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

    get atomicMass() {
        return this._atomicMass;
    }
    
    get halfLife() {
        return this._halfLife;
    }
    
    get decayMode() {
        return this._decayMode;
    }
}

NuclearMaterial.PRESETS = ISOTOPES;

export default NuclearMaterial;