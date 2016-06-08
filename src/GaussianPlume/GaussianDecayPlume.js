/**
 * Created by austin on 6/6/16.
 */

import GaussianPlume from './GaussianPlume';

/*
* Understanding Radioactive Aerosols and Their Measurement
* https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
* 
* */

class GaussianDecayPlume extends GaussianPlume {

    /**
     * 
     * @param atmosphere {Atmosphere}
     * @param source {Source}
     * @param halfLife {number} (seconds)
     */
    constructor(atmosphere, source, halfLife) {
        super(atmosphere, source);
        this._halfLife = halfLife; // Usually the half-life of the pollutant
        this._decayCoeff = 0.693 / halfLife;
    }

    getHalfLife() {
        return this._halfLife;
    }
    
    /**
     * Read URAaTM pg 281 - 285
     * @param x downwind distance (m)
     * @param windSpeed at _source height (m/s)
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
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    getConcentration(x, y, z) {
        let unDecayed = super.getConcentration(x, y, z);
        let decayTerm = this.getDecayTerm(x, this._atmosphere.getWindSpeed());
        return unDecayed * decayTerm;
    }
}

export default GaussianDecayPlume;