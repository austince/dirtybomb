/**
 * Created by austin on 6/6/16.
 * @file GaussianDecayPlume.js
 */

import GaussianPlume from './GaussianPlume';

/*
* Understanding Radioactive Aerosols and Their Measurement
* https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
* 
* */

/**
 * An extension (surprise surprise) on the Gaussian Plume to account for radioactive materials
 */
class GaussianDecayPlume extends GaussianPlume {

    /**
     * @override
     * @param {Atmosphere} atmosphere
     * @param {Source} source
     * @param {number} halfLife - seconds
     */
    constructor(atmosphere, source, halfLife) {
        super(atmosphere, source);
        /**
         * 
         * @type {number}
         * @private
         */
        this._halfLife = halfLife; // Usually the half-life of the pollutant
        /**
         * 
         * @type {number}
         * @private
         */
        this._decayCoeff = 0.693 / halfLife;
    }

    /**
     * 
     * @returns {number}
     */
    getHalfLife() {
        return this._halfLife;
    }
    
    /**
     * Read URAaTM pg 281 - 285
     * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
     * @param {number} x - downwind distance (m)
     * @param {number} windSpeed - at source _height (m/s)
     * @returns {number} Decay term
     */
    getDecayTerm(x, windSpeed) {
        if (this._decayCoeff == 0) {
            return 1;
        } else {
            return Math.exp(- this._decayCoeff * (x / windSpeed));
        }
    }

    /**
     * Takes into account the decay term, as seen in URAaTM pg 281
     * Overridden from super class
     * @override
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    getConcentration(x, y, z) {
        let unDecayed = super.getConcentration(x, y, z);
        let decayTerm = this.getDecayTerm(x, this.atmosphere.getWindSpeed());
        return unDecayed * decayTerm;
    }
}

export default GaussianDecayPlume;