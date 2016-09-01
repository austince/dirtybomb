/**
 * Created by austin on 6/2/16.
 * file: Source.js
 */

/**
 * Currently only supporting Point sources
 * @type {{POINT: string, VOLUME: string, AREA: string}}
 */
const SourceType = {
    POINT: 'point',
    VOLUME: 'volume',
    AREA: 'area'
};

/**
 * Where the contaminate comes from !
 */
class Source {
    
    /**
     * 
     * @param {string} type - The type of source 
     * @param {number} emissionRate - Maximum hourly emissions rate in g/s
     * @param {number} height - m
     * @param {number} radius - m
     * @param {number} temperature - Kelvin
     * @param {number} exitVelocity -  m/s
     */
    constructor(type, emissionRate, height, radius, temperature, exitVelocity) {
        /**
         * 
         * @type {number}
         * @private
         */
        this._emissionRate = emissionRate;
        /**
         * 
         * @type {number}
         * @private
         */
        this._height = height;
        /**
         * 
         * @type {number}
         * @private
         */
        this._radius = radius;
        /**
         * 
         * @type {SourceType}
         * @private
         */
        this._type = type;
        /**
         * 
         * @type {number}
         * @private
         */
        this._temp = temperature;
        /**
         * 
         * @type {number}
         * @private
         */
        this._exitVel = exitVelocity;
    }

    /**
     * 
     * @returns {string}
     */
    toString() {
        return `${this.type}: Emission rate of ${this.emissionRate} g/s`;
    }

    /**
     * 
     * @param {number} rate - (g/s)
     * @returns {Source}
     */
    setEmissionRate(rate) {
        this._emissionRate = rate;
        return this;
    }
    /**
     * 
     * @returns {number}
     */
    get emissionRate() {
        return this._emissionRate;
    }

    /**
     * 
     * @param {number} height
     * @returns {Source}
     */
    setHeight(height) {
        this._height = height;
        return this;
    }
    /**
     * 
     * @returns {number}
     */
    get height() {
        return this._height;
    }

    /**
     * 
     * @param {number} radius
     * @returns {Source}
     */
    setRadius(radius) {
        this._radius = radius;
        return this;
    }
    
    /**
     * 
     * @returns {number}
     */
    get radius() {
        return this._radius;
    }

    /**
     * 
     * @returns {SourceType}
     */
    get type() {
        return this._type;
    }

    /**
     * 
     * @param {number} temp
     * @returns {Source}
     */
    setTemperature(temp) {
        this._temp = temp;
        return this;
    }
    
    /**
     * 
     * @returns {number}
     */
    get temperature() {
        return this._temp;
    }

    /**
     * 
     * @param {number} velocity
     * @returns {Source}
     */
    setExitVelocity(velocity) {
        this._exitVel = velocity;
        return this;
    }
    /**
     * 
     * @returns {number}
     */
    get exitVelocity() {
        return this._exitVel;
    }
}

Source.SourceType = SourceType;

export {SourceType};
export default Source;
