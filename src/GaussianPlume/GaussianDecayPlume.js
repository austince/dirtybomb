/**
 * Created by austin on 6/6/16.
 */

import GaussianPlume from './GaussianPlume';


class GaussianDecayPlume extends GaussianPlume {
    constructor(atmosphere, source, halfLife) {
        super(atmosphere, source);
        this._halfLife = halfLife; // Usually the half-life of the pollutant
        this._decayCoeff = 0.693 / halfLife;
    }

    /**
     *
     * @param x downwind distance (m)
     * @param windSpeed at source height (m/s)
     * @returns {number} Decay term
     */
    getDecayTerm(x, windSpeed) {
        if (this._decayCoeff == 0) {
            return 1;
        } else {
            return Math.exp(- this._decayCoeff * (x / windSpeed));
        }
    }
}

export default GaussianDecayPlume;