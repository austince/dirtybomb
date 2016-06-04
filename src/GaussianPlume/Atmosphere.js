/**
 * Created by austin on 6/2/16.
 * file: Atmosphere.js
 */


// On a scale of 1 - 7
// Extremely unstable A ... DD, DN ... F Moderately Stable
const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

// Overcast should always recieve a 4 (D)
// Maps windSpeed and skyCover to a grade
// [<2, 2-3, 3-5, 5-6, >6] then
// [strong, moderate, slight]
// FIXME: Should be indexed starting at 0
const DAY_GRADES = [
    [1, 2, 2],
    [2, 2, 3],
    [2, 3, 3],
    [3, 4, 4],
    [3, 4, 4]
];

// [skyCover >= .5, skyCover < .5]
// Defined as one hour before sunset to one hour after sunrise
// Todo: Account for time of day
const NIGHT_GRADES = {
    "<2": [4, 4], // Not given in the docs but will assume 4 / never used
    "2-3": [6, 7],
    "3-5": [5, 6],
    "5-6": [5, 5],
    ">6": [5, 5]
};

const WIND_PROFILES = [
    {rural: 0.07, urban: 0.15},
    {rural: 0.07, urban: 0.15},
    {rural: 0.1, urban: 0.2},
    {rural: 0.15, urban: 0.3},
    {rural: 0.15, urban: 0.3},
    {rural: 0.35, urban: 0.3},
    {rural: 0.55, urban: 0.3}
];

class Atmosphere {

    /**
     *
     * @param windSpeed at ground level (m/s)
     * @param skyCover a percentage 0-1
     * @param solarElevation (degrees)
     * @param temperature (Kelvin)
     */
    constructor(windSpeed, skyCover, solarElevation, temperature) {
        this.windSpeed = windSpeed;
        this.skyCover = skyCover;
        this.solarElevation = solarElevation;
        this.temp = temperature;
        
        let insolation = 0;
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

        if (windSpeed < 2) {
            // < 2
            this.grade = DAY_GRADES[0][insolation];
        } else if (windSpeed < 3) {
            // 2 - 3
            this.grade = DAY_GRADES[1][insolation];
        } else if (windSpeed < 5) {
            // 3 - 5
            this.grade = DAY_GRADES[2][insolation];
        } else if (windSpeed < 6) {
            // 5 - 6
            this.grade = DAY_GRADES[3][insolation];
        } else {
            // > 6
            this.grade = DAY_GRADES[4][insolation];
        }
    }

    /**
     * 
     * @returns {number} 1-7
     */
    getGrade() {
        return this.grade;
    }

    /**
     * 
     * @returns {string} A - F
     */
    getLetterGrade() {
        return LETTER_GRADES[this.grade-1];
    }

    getTemperature() {
        return this.temp;
    }
    
    /**
     * Adjusts wind speed to a specific height. Approximation.
     * @param height (m)
     * @returns {number} The approx. wind speed at a specified height above the ground (m/s)
     */
    getWindSpeedAt(height) {
        // Assumes ground wind speed was measured at 10m
        // Will also assume for now that these are all rural areas
        let windProfile = WIND_PROFILES[this.getGrade()].urban;
        return this.windSpeed * Math.pow((height / 10), windProfile);
    }
}

export default Atmosphere;