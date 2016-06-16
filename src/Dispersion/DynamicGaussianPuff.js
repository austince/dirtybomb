/**
 * Created by austin on 6/16/16.
 * @file DynamicGaussianPuff.js
 * 
 */

import Vector from './Vector';
import GaussianPuff from './GaussianPuff';

/**
 * Allows for atmospheric changes between puff movements
 */
class DynamicGaussianPuff extends GaussianPuff {
    /**
     *
     * @param {Atmosphere} atmosphere
     * @param {Source} source
     * @param {number} massReleased
     */
    constructor(atmosphere, source, massReleased) {
        super(atmosphere, source, massReleased);

        /**
         * 
         * @type {number}
         * @private
         */
        this._currentTime = 0;

        /**
         * 
         * @type {Vector}
         * @private
         */
        this._currentCenter = new Vector(0, 0, this.getEffectiveSourceHeight());
    }

    /**
     * Moves the puff along by t seconds
     * @param {number} t - seconds to increment by
     */
    step(t) {
        this._currentTime += t;
    }
}

export default DynamicGaussianPuff;