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
     * @param {number} type - The type of source 
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
        this.emissionRate = emissionRate;
        /**
         * 
         * @type {number}
         */
        this.height = height;
        /**
         * 
         * @type {number}
         */
        this.radius = radius;
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
        return "${this.} Emission rate of ${this.emissionRate} g/s";
    }

    /**
     * 
     * @returns {number}
     */
    getEmissionRate() {
        return this.emissionRate;
    }

    /**
     * 
     * @returns {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * 
     * @returns {number}
     */
    getRadius() {
        return this.radius;
    }

    /**
     * 
     * @returns {SourceType}
     */
    getType() {
        return this._type;
    }

    /**
     * 
     * @returns {number}
     */
    getTemperature() {
        return this._temp;
    }

    /**
     * 
     * @returns {number}
     */
    getExitVelocity() {
        return this.exitVel;
    }
}

Source.SourceType = SourceType;

export {SourceType};
export default Source;
