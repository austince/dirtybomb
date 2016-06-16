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
     * @param {array} [center] - Manually set the center, defaults to (0,0,0)
     */
    constructor(atmosphere, source, massReleased, center) {
        super(atmosphere, source, massReleased);

        /**
         * 
         * @type {number}
         * @private
         */
        this._currentTime = 0;

        /**
         * Really doesn't need to be a vector. Easy enough to use a vector as a cartesian coord though.
         * @type {Vector}
         * @private
         */
        this._currentCenter = center ? Vector.fromArray(center) : new Vector(0, 0, this.getEffectiveSourceHeight());

        /**
         * @type {Vector}
         * @private
         */
        this._startCenter = this._currentCenter.clone();

        /**
         *
         * @type {Array}
         * @private
         */
        this._path = [];

        /**
         * dY
         * @type {number}
         * @private
         */
        this._virtHoriz = 0;

        /**
         * dZ
         * @type {number}
         * @private
         */
        this._vertDist = 0;

        /**
         * 
         * @type {number}
         * @private
         */
        this._stdY = 0;

        /**
         * 
         * @type {number}
         * @private
         */
        this._stdZ = 0;
    }

    /**
     * 
     * @returns {number}
     */
    get time() {
        return this._currentTime;
    }

    /**
     *
     * @param center
     * @returns {DynamicGaussianPuff}
     * @private
     */
    _setCenter(center) {
        this._currentCenter = center;
        return this;
    }

    /**
     *
     * @returns {Vector}
     */
    getCenter() {
       return this._currentCenter;
    }

    /**
     *
     * @returns {Vector}
     */
    getStart() {
        return this._startCenter;
    }

    /**
     * 
     * @returns {number}
     */
    getDistanceFromStart() {
        return this.getCenter().subtract(this.getStart()).abs();
    }

    /**
     * 
     * @returns {number}
     */
    getDistanceTraveled() {
        let dist = 0;
        let start = this.getStart();
        for (var point of this._path) {
            dist += point.subtract(start).abs();
            start = point;
        }
        return dist;
    }

    /**
     * A helper function for the StdZ calculation
     * @override
     * @protected
     * @returns {STD_Y_COEFF}
     */
    _getStdYCoeffs() {
        let x = this.getDistanceTraveled();
        return super._getStdYCoeffs(x);
    }
    
    /**
     * Brookhaven sigma
     * The crosswind distance standard deviation for a distance x downwind.
     * To be used in a Gaussian distribution
     * @override
     * @returns {number} crosswind standard deviation at x meters downwind (m)
     */
    getStdY() {
        return this._stdY;
    }

    /**
     * Brookhaven sigma
     * The vertical distance standard deviation for a distance x downwind.
     * To be used in a Gaussian distribution
     * @override
     * @returns {number}
     */
    getStdZ() {
        return this._stdZ;
    }

    /**
     * 
     * @returns {number|*}
     */
    getVirtHoriz() {
        return this._virtHoriz;
    }

    /**
     * 
     * @returns {number|*}
     */
    getVertDist() {
        return this._vertDist;
    }
    
    /**
     * Moves the puff along by t seconds
     * @see http://www.sciencedirect.com/science/article/pii/S0093641303000247 Section 3.2, equation 14
     * @param {number} deltaT - seconds to increment by
     * @returns {DynamicGaussianPuff}
     */
    step(deltaT) {
        // update vertHoriz and vertDist
        let x = this.getDistanceTraveled();
        let stdYCoeffs = super._getStdYCoeffs(x);
        let stdZCoeffs = super._getStdZCoeffs(x);

        // Update the Virtual horizontal and the vertical distance @see equation 15
        this._virtHoriz = Math.pow((this.getStdY() / stdYCoeffs.c), (1 / stdYCoeffs.d));
        this._vertDist = Math.pow((this.getStdZ() / stdZCoeffs.a), (1 / stdZCoeffs.b));

        // Find the change in x and y directions
        // Todo: use Navier-Stokes equation solver to account for momentum @see equation 16
        let deltaDVec = this.getAtmosphere().getWindSpeedVec().multiply(deltaT);    // The change in distance from wind
        let deltaD = deltaDVec.abs();

        // Update the standard deviations @see equation 17
        this._stdY = stdYCoeffs.c * Math.pow(this.getVirtHoriz() + deltaD, stdYCoeffs.d);
        this._stdZ = stdZCoeffs.a * Math.pow(this.getVertDist() + deltaD, stdZCoeffs.b);

        // Update position/time/path
        this._currentTime += deltaT;
        this._setCenter(this.getCenter().add(deltaDVec));
        this._path.push(this.getCenter().clone());
        
        return this;
    }

    /**
     * @see http://www.sciencedirect.com/science/article/pii/S0093641303000247 Section 3.2, equation 14
     * @override
     * @param {number} x - downwind (m)
     * @param {number} y - crosswind (m)
     * @param {number} z - height (m)
     * @returns {number}
     */
    getConcentration(x, y, z) {
        let stdY = this.getStdY();
        let stdZ = this.getStdZ();
        let H = this.getEffectiveSourceHeight();

        let a = this.getMassReleased() / (Math.pow(2 * Math.PI, 1.5) * Math.pow(stdY, 2) * stdZ);
        let b = Math.exp(-0.5 * Math.pow(x / stdY, 2));
        let c = Math.exp(-0.5 * Math.pow(y / stdY, 2));
        let d = Math.exp(-0.5 * Math.pow((z - H) / stdZ, 2));

        return a * b * c * d;
    }

}

export default DynamicGaussianPuff;