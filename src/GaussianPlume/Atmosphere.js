/**
 * Created by austin on 6/2/16.
 * file: Atmosphere.js
 */


// On a scale of 0 - 6
// Extremely unstable A ... DD, DN ... F Moderately Stable
const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

// Overcast should always recieve a 4 (D)
// Maps windSpeed and skyCover to a grade
// [<2, 2-3, 3-5, 5-6, >6] then
// [strong, moderate, slight]
const DAY_GRADES = [
    [0, 1, 1],
    [1, 1, 2],
    [1, 2, 2],
    [2, 3, 3],
    [2, 3, 3]
];

// [skyCover >= .5, skyCover < .5]
// Defined as one hour before sunset to one hour after sunrise
// Todo: Account for time of day
const NIGHT_GRADES = {
    "<2": [3, 3], // Not given in the docs but will assume 4 / never used
    "2-3": [5, 6],
    "3-5": [4, 5],
    "5-6": [4, 4],
    ">6": [4, 4]
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
     * @param setting 
     */
    constructor(windSpeed, skyCover, solarElevation, temperature, setting = "urban") {
        this.windSpeed = windSpeed;
        this.skyCover = skyCover;
        this.solarElevation = solarElevation;
        this.temp = temperature;
        this.setting = setting;
        
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
        return LETTER_GRADES[this.grade];
    }

    getTemperature() {
        return this.temp;
    }
    
    setSetting(setting) {
        this.setting = setting;
    }
    getSetting() {
        return this.setting;
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