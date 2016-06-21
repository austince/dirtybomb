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
    get center() {
       return this._currentCenter;
    }
    
    get path() {
        return this._path;
    }

    /**
     *
     * @returns {Vector}
     */
    get start() {
        return this._startCenter;
    }

    /**
     * 
     * @returns {number}
     */
    get distanceFromStart() {
        return this.getCenter().subtract(this.start).abs();
    }

    /**
     * 
     * @returns {number}
     */
    get distanceTraveled() {
        let dist = 0;
        let start = this.start;
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
        let x = this.distanceTraveled;
        return super._getStdYCoeffs(x);
    }
    
    /**
     * Brookhaven sigma
     * The crosswind distance standard deviation for a distance x downwind.
     * To be used in a Gaussian distribution
     * @override
     * @returns {number} crosswind standard deviation at x meters downwind (m)
     */
    get stdY() {
        return this._stdY;
    }

    /**
     * Brookhaven sigma
     * The vertical distance standard deviation for a distance x downwind.
     * To be used in a Gaussian distribution
     * @override
     * @returns {number}
     */
    get stdZ() {
        return this._stdZ;
    }

    /**
     * 
     * @returns {number|*}
     */
    get virtHoriz() {
        return this._virtHoriz;
    }

    /**
     * 
     * @returns {number|*}
     */
    get vertDist() {
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
        let x = this.distanceTraveled;
        let stdYCoeffs = super._getStdYCoeffs(x);
        let stdZCoeffs = super._getStdZCoeffs(x);

        // Update the Virtual horizontal and the vertical distance @see equation 15
        this._virtHoriz = Math.pow((this.stdY / stdYCoeffs.c), (1 / stdYCoeffs.d));
        this._vertDist = Math.pow((this.stdZ / stdZCoeffs.a), (1 / stdZCoeffs.b));

        // Find the change in x and y directions
        // Todo: use Navier-Stokes equation solver to account for momentum @see equation 16
        let deltaDVec = this.getAtmosphere().windSpeedVec.multiply(deltaT);    // The change in distance from wind
        let deltaD = deltaDVec.abs();

        // Update the standard deviations @see equation 17
        this._stdY = stdYCoeffs.c * Math.pow(this.virtHoriz + deltaD, stdYCoeffs.d);
        this._stdZ = stdZCoeffs.a * Math.pow(this.vertDist + deltaD, stdZCoeffs.b);

        // Update position/time/path
        this._currentTime += deltaT;
        this._setCenter(this.center.add(deltaDVec));
        this._path.push(this.center.clone());
        
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
        let stdY = this.stdY;
        let stdZ = this.stdZ;
        let H = this.getEffectiveSourceHeight();

        let a = this.massReleased / (Math.pow(2 * Math.PI, 1.5) * Math.pow(stdY, 2) * stdZ);
        let b = Math.exp(-0.5 * Math.pow(x / stdY, 2));
        let c = Math.exp(-0.5 * Math.pow(y / stdY, 2));
        let d = Math.exp(-0.5 * Math.pow((z - H) / stdZ, 2));

        return a * b * c * d;
    }

}

export default DynamicGaussianPuff;