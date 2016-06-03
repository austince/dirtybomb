/**
 * Created by austin on 6/2/16.
 */

// On a scale of 1 - 7, same as
// Extremely unstable A ... DD, DN ... F Moderately Stable
const letterGrades = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

// Overcast should always recieve a 4 (D)
// Maps windSpeed and skyCover to a grade
// [<2, 2-3, 3-5, 5-6, >6] then
// [strong, moderate, slight]
const dayGrades = [
    [1, 2, 2],
    [2, 2, 3],
    [2, 3, 3],
    [3, 4, 4],
    [3, 4, 4]
];
// [skyCover >= .5, skyCover < .5]
// Defined as one hour before sunset to one hour after sunrise
// Todo
const nightGrades = {
    "<2": [4, 4], // Not given in the docs but will assume 4 / never used
    "2-3": [6, 7],
    "3-5": [5, 6],
    "5-6": [5, 5],
    ">6": [5, 4]
};

/**
 *
 */
class AtmosphericStability {

    /**
     *
     * @param windSpeed
     * @param skyCover
     * @param solarElevation
     */
    constructor(windSpeed, skyCover, solarElevation) {
        this.windSpeed = windSpeed;
        this.skyCover = skyCover;
        this.solarElevation = solarElevation;

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
            this.grade = dayGrades[0][insolation];
        } else if (windSpeed < 3) {
            // 2 - 3
            this.grade = dayGrades[1][insolation];
        } else if (windSpeed < 5) {
            // 3 - 5
            this.grade = dayGrades[2][insolation];
        } else if (windSpeed < 6) {
            // 5 - 6
            this.grade = dayGrades[3][insolation];
        } else {
            // > 6
            this.grade = dayGrades[4][insolation];
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
        return letterGrades[this.grade-1];
    }
}

export default AtmosphericStability;