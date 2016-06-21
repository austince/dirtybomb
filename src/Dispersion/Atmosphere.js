/**
 * Created by austin on 6/2/16.
 * @file Atmosphere.js
 */

import Vector from './Vector';

/**
 * On a scale of 0 - 6
 * Extremely unstable A ... DD, DN ... F Moderately Stable
 * @type {string[]}
 */
const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

/**
 * Overcast should always receive a 3 (D)
 * From Table. 2 on Page 9, all mid grades are rounded up.
 * Maps _windSpeedVec and _skyCover to a grade
 * [<2, 2-3, 3-5, 5-6, >6] then
 * [strong, moderate, slight]
 * @type {number[][]}
 */
const DAY_GRADES = [
    [0, 0, 1],
    [0, 1, 2],
    [1, 1, 2],
    [2, 2, 3],
    [2, 3, 3]
];

/**
 * Defined as one hour before sunset to one hour after sunrise
 * NOTE: Night Grade D is DN, 4
 * [_skyCover > .5, _skyCover < .5]
 * @type {number[][]}
 */
const NIGHT_GRADES = [  
    [4, 4], // No given, assumed Class D / not practically possible
    [5, 6],
    [4, 5],
    [4, 4],
    [4, 4]
];

/**
 * Contains constants for wind in rural / urban settings
 * @type {Object[]}
 * @property {number} rural
 * @property {number} urban
 */
const WIND_PROFILES = [
    {rural: 0.07, urban: 0.15},
    {rural: 0.07, urban: 0.15},
    {rural: 0.1, urban: 0.2},
    {rural: 0.15, urban: 0.3},
    {rural: 0.15, urban: 0.3},
    {rural: 0.35, urban: 0.3},
    {rural: 0.55, urban: 0.3}
];

/**
 * Represents the physical surroundings of a Gaussian Plume
 */
class Atmosphere {

    /**
     * Only windSpeed, _skyCover, and _solarElevation are required.
     * Temperature is required when not _setting effective source height manually
     * The default is urban daytime.
     * @param {array | number} windSpeed - at ground level (m/s)
     * @param {number} skyCover - a percentage 0-1
     * @param {number} solarElevation - (degrees)
     * @param {number} temperature - (Kelvin)
     * @param {number} pressure - (atm)
     * @param {string} [setting="urban"]
     * @param {boolean} [isNight=false] - Can change this to a Date, but should be simple enough to keep track of for the user
     *          1 hour before sunset and 1 hour past sunrise
     */
    constructor(windSpeed, skyCover, solarElevation, temperature, pressure = 1, setting = "urban", isNight = false) {
        /**
         * 
         * @type {Vector}
         * @private
         */
        this._windSpeedVec = Array.isArray(windSpeed) ? Vector.fromArray(windSpeed) : new Vector(windSpeed);
        /**
         * 
         * @type {number}
         * @private
         */
        this._skyCover = skyCover;
        /**
         * 
         * @type {number}
         * @private
         */
        this._solarElevation = solarElevation;
        /**
         * 
         * @type {number}
         */
        this._temp = temperature;
        /**
         * 
         * @type {number}
         * @private
         */
        this._pressure = pressure;
        /**
         * 
         * @type {string}
         * @private
         */
        this._setting = setting;
        /**
         * 
         * @type {boolean}
         * @private
         */
        this._isNight = isNight;
        //this.grade = Atmosphere.calculateGrade(_skyCover, _solarElevation, _windSpeedVec);
    }

    /**
     * 
     * @returns {string}
     */
    toString() {
        return "Grade: " + this.letterGrade +
            " Wind at " + this.getWindSpeed() + " m/s," +
            " Sun at " + this._solarElevation + " degrees";
    }

    /* Static methods: these seemed more convenient at the time so one wouldn't have
    * to build a whole Atmosphere object to calculate a grade, but now seem useless */

    /**
     * Helper function for grade calculation
     * @private
     * @param {number} windSpeed - m/s
     * @returns {number} index of windLevel in WIND_PROFILES
     */
    static _getWindLevel(windSpeed) {
        let level;
        if (windSpeed < 2) {
            // < 2
            level = 0;
        } else if (windSpeed < 3) {
            // 2 - 3
            level = 1;
        } else if (windSpeed < 5) {
            // 3 - 5;
            level = 2;
        } else if (windSpeed < 6) {
            // 5 - 6
            level = 3;
        } else {
            // > 6
            level = 4;
        }
        return level;
    }

    /**
     * Helper function for grade calculation
     * @private
     * @param {number} skyCover 
     * @param {number} solarElevation 
     * @returns {number} 
     */
    static _getInsolationLevel(skyCover, solarElevation) {
        let insolation;
        if (skyCover <= .5) {
            if (solarElevation > 60) {
                // strong
                insolation = 0;
            } else if (solarElevation > 35) {
                // moderate
                insolation = 1;
            } else {
                // slight
                insolation = 2;
            }
        } else {
            if (solarElevation > 60) {
                // moderate
                insolation = 1;
            } else if (solarElevation > 35) {
                // slight
                insolation = 2;
            } else {
                // slight
                insolation = 2;
            }
        }
        return insolation;
    }

    /**
     * Calculates a grade with given parameters
     * @param {number} skyCover 
     * @param {number} solarElevation 
     * @param {number} windSpeed
     * @param {boolean} isNight 
     * @returns {number} 0 - 6
     */
    static calculateGrade(skyCover, solarElevation, windSpeed, isNight) {
        let grade;
        let windLevel = Atmosphere._getWindLevel(windSpeed);
        if (isNight) {
            let coverLevel = skyCover > .5 ? 0 : 1; // For night, just two columns
            grade = NIGHT_GRADES[windLevel][coverLevel];
        } else {
            let insolation = Atmosphere._getInsolationLevel(skyCover, solarElevation);
            grade = DAY_GRADES[windLevel][insolation];
        }
        return grade;
    }
    
    /**
     * 
     * @returns {number} 0-6
     */
    getGrade() {
        return Atmosphere.calculateGrade(this.skyCover, this.solarElevation, this.getWindSpeed(), this.isNight);
    }
    
    /**
     * The Human readable
     * @returns {string} A - F
     */
    get letterGrade() {
        return LETTER_GRADES[this.getGrade()];
    }

    /**
     * 
     * @param speed {number[]|number} m/s
     * @returns {Atmosphere}
     */
    setWindSpeed(speed) {
        this._windSpeedVec = Array.isArray(speed) ? Vector.fromArray(speed) : new Vector(speed);
        return this;
    }

    /**
     * 
     * @returns {Vector|*}
     */
    get windSpeedVec() {
        return this._windSpeedVec;
    }
    
    /**
     * 
     * @returns {number} m/s
     */
    getWindSpeed() {
        return this.windSpeedVec.abs();
    }

    /**
     * The percentage of the sky is covered
     * @param {number} cover - 0 - 1
     * @returns {Atmosphere}
     */
    setSkyCover(cover) {
        this._skyCover = cover;
        return this;
    }

    /**
     * 
     * @returns {number}
     */
    get skyCover() {
        return this._skyCover;
    }

    /**
     * 
     * @param {number} elevation - degrees 
     * @returns {Atmosphere}
     */
    setSolarElevation(elevation) {
        this._solarElevation = elevation;
        return this;
    }

    /**
     * 
     * @returns {number} degrees
     */
    get solarElevation() {
        return this._solarElevation;
    }

    /**
     * 
     * @param {number} temp - Kelvin
     * @returns {Atmosphere}
     */
    setTemperature(temp) {
        this._temp = temp;
        return this;
    }

    /**
     * 
     * @returns {number|*} Kelvin
     */
    get temperature() {
        return this._temp;
    }

    /**
     * 
     * @param pressure
     * @returns {Atmosphere}
     */
    setPressure(pressure) {
        this._pressure = pressure;
        return this;
    }

    /**
     * 
     * @returns {number}
     */
    get pressure() {
        return this._pressure;
    }

    /**
     * 
     * @param {string} setting - Either "rural" or "urban"
     * @returns {Atmosphere}
     */
    setSetting(setting) {
        this._setting = setting;
        return this;
    }

    /**
     * 
     * @returns {string}
     */
    get setting() {
        return this._setting;
    }

    /**
     * 
     * @param {boolean} isNight
     * @returns {Atmosphere}
     */
    setIsNight(isNight) {
        this._isNight = isNight;
        return this;
    }

    /**
     *
     * @returns {boolean|*}
     */
    get isNight() {
        return this._isNight;
    }
    
    /**
     * Adjusts wind speed to a specific height. Approximation.
     * @param {number} height - m
     * @returns {number} The approx. wind speed at a specified height above the ground (m/s)
     */
    getWindSpeedAt(height) {
        // Assumes ground wind speed was measured at 10m
        let windProfile = this._setting === 'urban' ? 
            WIND_PROFILES[this.getGrade()].urban : WIND_PROFILES[this.getGrade()].rural;
        return this.getWindSpeed() * Math.pow((height / 10), windProfile);
    }
}

export default Atmosphere;