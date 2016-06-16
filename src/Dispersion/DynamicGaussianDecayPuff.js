/**
 * Created by austin on 6/16/16.
 * @file DynamicGaussianDecayPuff.js
 * 
 */

import DynamicGaussianPuff from './DynamicGaussianPuff';

/**
 * Adds half life decay to the Dynamic Puff
 */
class DynamicGaussianDecayPuff extends DynamicGaussianPuff {

    /**
     *
     * @param {Atmosphere} atmosphere
     * @param {Source} source
     * @param {number} massReleased
     * @param {number} halfLife - seconds
     * @param {array} [center] - Manually set the center, defaults to (0,0,0)
     */
    constructor(atmosphere, source, massReleased, halfLife, center) {
        super(atmosphere, source, massReleased, center);

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
     * @param {number} windSpeed - at source height (m/s)
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
     * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
     * @override
     * @param {number} x - downwind (m)
     * @param {number} y - crosswind (m)
     * @param {number} z - height (m)
     */
    getConcentration(x, y, z) {
        let unDecayed = super.getConcentration(x, y, z);
        let decayTerm = this.getDecayTerm(x, this.getAtmosphere().getWindSpeed());
        return unDecayed * decayTerm;
    }
}