/**
 * Created by austin on 6/2/16.
 * @file Atmosphere.js
 */

/**
 * On a scale of 0 - 6
 * Extremely unstable A ... DD, DN ... F Moderately Stable
 * @type {string[]}
 */
const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

/**
 * Overcast should always receive a 3 (D)
 * From Table. 2 on Page 9, all mid grades are rounded up.
 * Maps windSpeed and skyCover to a grade
 * [<2, 2-3, 3-5, 5-6, >6] then
 * [strong, moderate, slight]
 * @type {*[]}
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
 * [skyCover > .5, skyCover < .5]
 * @type {*[]}
 */
const NIGHT_GRADES = [  
    [4, 4], // No given, assumed Class D / not practically possible
    [5, 6],
    [4, 5],
    [4, 4],
    [4, 4]
];

/**
 * 
 * @type {*[]}
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
 *
 */
class Atmosphere {

    /**
     *
     * @param windSpeed at ground level (m/s)
     * @param skyCover a percentage 0-1
     * @param solarElevation (degrees)
     * @param temperature (Kelvin)
     * @param setting
     * @param isNight {boolean} Can change this to a Date, but should be simple enough to keep track of for the user
     *          1 hour before sunset and 1 hour past sunrise
     */
    constructor(windSpeed, skyCover, solarElevation, temperature, setting = "urban", isNight = false) {
        this.windSpeed = windSpeed;
        this.skyCover = skyCover;
        this.solarElevation = solarElevation;
        this.temp = temperature;
        this.setting = setting;
        this._isNight = isNight;
        //this.grade = Atmosphere.calculateGrade(skyCover, solarElevation, windSpeed);
    }
    
    toString() {
        return "Grade: " + this.getLetterGrade() +
            " Wind at " + this.windSpeed + " m/s," +
            " Sun at " + this.solarElevation + " degrees";
    }

    /* Static methods: these seemed more convenient at the time so one wouldn't have
    * to build a whole Atmosphere object to calculate a grade, but now seem useless */

    /**
     * Helper function for grade calculation
     * @param windSpeed {number}
     * @returns {number} index of windLevel 
     */
    static getWindLevel(windSpeed) {
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
     * @param skyCover {number}
     * @param solarElevation {number}
     * @returns {*}
     */
    static getInsolationLevel(skyCover, solarElevation) {
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
     * @param skyCover {number}
     * @param solarElevation {number}
     * @param windSpeed {number}
     * @param isNight {boolean}
     * @returns {*}
     */
    static calculateGrade(skyCover, solarElevation, windSpeed, isNight) {
        let grade;
        let windLevel = Atmosphere.getWindLevel(windSpeed);
        if (isNight) {
            let coverLevel = skyCover > .5 ? 0 : 1; // For night, just two columns
            grade = NIGHT_GRADES[windLevel][coverLevel];
        } else {
            let insolation = Atmosphere.getInsolationLevel(skyCover, solarElevation);
            grade = DAY_GRADES[windLevel][insolation];
        }
        
        return grade;
    }

    /**
     * 
     * @returns {number} 0-6
     */
    getGrade() {
        return Atmosphere.calculateGrade(this.skyCover, this.solarElevation, this.windSpeed, this._isNight);
    }
    /**
     * The Human readable
     * @returns {string} A - F
     */
    getLetterGrade() {
        return LETTER_GRADES[this.getGrade()];
    }

    /**
     * 
     * @param speed {number} m/s
     * @returns {Atmosphere}
     */
    setWindSpeed(speed) {
        this.windSpeed = speed;
        return this;
    }
    getWindSpeed() {
        return this.windSpeed;
    }

    /**
     * The percentage of the sky is covered
     * @param cover {number} 0 - 1
     * @returns {Atmosphere}
     */
    setSkyCover(cover) {
        this.skyCover = cover;
        return this;
    }
    getSkyCover() {
        return this.skyCover;
    }

    /**
     * 
     * @param elevation {number} degrees 
     * @returns {Atmosphere}
     */
    setSolarElevation(elevation) {
        this.solarElevation = elevation;
        return this;
    }
    getSolarElevation() {
        return this.solarElevation;
    }

    /**
     * 
     * @param temp {number} Kelvin
     * @returns {Atmosphere}
     */
    setTemperature(temp) {
        this.temp = temp;
        return this;
    }
    getTemperature() {
        return this.temp;
    }

    /**
     * 
     * @param setting {string} Either "rural" or "urban"
     * @returns {Atmosphere}
     */
    setSetting(setting) {
        this.setting = setting;
        return this;
    }
    getSetting() {
        return this.setting;
    }

    /**
     * 
     * @param isNight {boolean}
     * @returns {Atmosphere}
     */
    setIsNight(isNight) {
        this._isNight = isNight;
        return this;
    }
    isNight() {
        return this._isNight;
    }
    
    /**
     * Adjusts wind speed to a specific height. Approximation.
     * @param height (m)
     * @returns {number} The approx. wind speed at a specified height above the ground (m/s)
     */
    getWindSpeedAt(height) {
        // Assumes ground wind speed was measured at 10m
        let windProfile = this.setting === 'urban' ? 
            WIND_PROFILES[this.getGrade()].urban : WIND_PROFILES[this.getGrade()].rural;
        return this.windSpeed * Math.pow((height / 10), windProfile);
    }
}

export default Atmosphere;