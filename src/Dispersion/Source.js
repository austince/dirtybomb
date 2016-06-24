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
         */
        this._emissionRate = emissionRate;
        /**
         * 
         * @type {number}
         */
        this._height = height;
        /**
         * 
         * @type {number}
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
         */
        this._temp = temperature;
        /**
         * 
         * @type {number}
         */
        this.exitVel = exitVelocity;
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
     * @returns {number}
     */
    get emissionRate() {
        return this._emissionRate;
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
     * @returns {number}
     */
    get temperature() {
        return this._temp;
    }

    /**
     * 
     * @returns {number}
     */
    get exitVelocity() {
        return this.exitVel;
    }
}

Source.SourceType = SourceType;

export {SourceType};
export default Source;
