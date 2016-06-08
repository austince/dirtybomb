/**
 * Created by austin on 6/2/16.
 * file: Source.js
 */

/**
 * Currently only supporting Point sources
 * @type {{POINT: number, VOLUME: number, AREA: number}}
 */
const SourceType = {
    POINT: 0,
    VOLUME: 1,
    AREA: 2
};

/**
 * Where the contaminate comes from !
 */
class Source {
    
    /**
     * 
     * @param type {SourceType} The type of source 
     * @param emissionRate {number} g/s
     * @param height {number} m
     * @param radius {number} m
     * @param temperature {number} Kelvin
     * @param exitVelocity {number} m/s
     */
    constructor(type, emissionRate, height, radius, temperature, exitVelocity) {
        this.emissionRate = emissionRate;
        this.height = height;
        this.radius = radius;
        this.type = type;
        this.temp = temperature;
        this.exitVel = exitVelocity;
    }

    toString() {
        return "Emission rate of " + this.emissionRate + " g/s";
    }

    getEmissionRate() {
        return this.emissionRate;
    }
    getHeight() {
        return this.height;
    }
    getRadius() {
        return this.radius;
    }
    getType() {
        return this.type;
    }
    getTemperature() {
        return this.temp;
    }
    getExitVelocity() {
        return this.exitVel;
    }
}

/**
 * Experimenting with ES6
 */
class Stack extends Source {
    constructor(...args) {
        super(...args);
        this.emissionRate = emissionRate;
        this.height = height;
        this.radius = radius;
        this.type = type;
        this.temp = temperature;
        this.exitVel = exitVelocity;
    }
}
export {Stack}

export {SourceType};
export default Source;
