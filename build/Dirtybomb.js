(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Dirtybomb = factory());
}(this, function () { 'use strict';

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

    class Source {
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
     * Created by austin on 6/2/16.
     * file: Atmosphere.js
     */


    // On a scale of 0 - 6
    // Extremely unstable A ... DD, DN ... F Moderately Stable
    const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

    // Overcast should always receive a 3 (D)
    // From Table. 2 on Page 9, all mid grades are rounded up.
    // Maps windSpeed and skyCover to a grade
    // [<2, 2-3, 3-5, 5-6, >6] then
    // [strong, moderate, slight]
    const DAY_GRADES = [
        [0, 0, 1],
        [0, 1, 2],
        [1, 1, 2],
        [2, 2, 3],
        [2, 3, 3]
    ];

    // Defined as one hour before sunset to one hour after sunrise
    // NOTE: Night Grade D is DN, 4
    // [skyCover > .5, skyCover < .5]
    const NIGHT_GRADES = [  
        [4, 4], // No given, assumed Class D / not practically possible
        [5, 6],
        [4, 5],
        [4, 4],
        [4, 4]
    ];

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
         *
         * @returns {string} A - F
         */
        getLetterGrade() {
            return LETTER_GRADES[this.getGrade()];
        }
        
        setWindSpeed(speed) {
            this.windSpeed = speed;
            return this;
        }
        getWindSpeed() {
            return this.windSpeed;
        }
        
        setSkyCover(cover) {
            this.skyCover = cover;
            return this;
        }
        getSkyCover() {
            return this.skyCover;
        }
        
        setSolarElevation(elevation) {
            this.solarElevation = elevation;
            return this;
        }
        getSolarElevation() {
            return this.solarElevation;
        }

        setTemperature(temp) {
            this.temp = temp;
            return this;
        }
        getTemperature() {
            return this.temp;
        }
        
        setSetting(setting) {
            this.setting = setting;
            return this;
        }
        getSetting() {
            return this.setting;
        }
        
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

    // 1 - 7 for atm stab grade
    // [x < 10000, x >= 10000]
    const STD_Y_COEFFS = [
        [{c: .495, d: .873}, {c: .606, d: .851}],
        [{c: .310, d: .897}, {c: .523, d: .840}],
        [{c: .197, d: .908}, {c: .285, d: .867}],
        [{c: .122, d: .916}, {c: .193, d: .865}],
        [{c: .122, d: .916}, {c: .193, d: .865}],
        [{c: .0934, d: .912}, {c: .141, d: .868}],
        [{c: .0625, d: .911}, {c: .0800, d: .884}]
    ];
    // [x < 500, 500 <= x < 5000, 5000 <= x]
    const STD_Z_COEFFS = [
        [{a: .0383, b: 1.281}, {a: .0002539, b: 2.089}, {a: .0002539, b: 2.089}],
        [{a: .1393, b: .9467}, {a: .04936, b: 1.114}, {a: .04936, b: 1.114}],
        [{a: .1120, b: .9100}, {a: .1014, b: .926}, {a: .1154, b: .9106}],
        [{a: .0856, b: .8650}, {a: .2591, b: .6869}, {a: .7368, b: .5642}],
        [{a: .0818, b: .8155}, {a: .2527, b: .6341}, {a: 1.297, b: .4421}],
        [{a: .1064, b: .7657}, {a: .2452, b: .6358}, {a: .9024, b: .4805}],
        [{a: .05645, b: .8050}, {a: .1930, b: .6072}, {a: 1.505, b: .3662}]
    ];

    class GaussianPlume {
        constructor(atmosphere, source) {
            this.setAtmosphere(atmosphere);
            this.addSource(source);
        }
        
        toString() {
            return this.source.toString() + " in " + this.atmosphere.toString();
        }

        addSource(source) {
            this.source = source;
            return this;
        }
        getSource() {
            return this.source;
        }

        /**
         * 
         * @param atmosphere {Atmosphere}
         */
        setAtmosphere(atmosphere) {
            this.atmosphere = atmosphere;
            return this;
        }
        getAtmosphere() {
            return this.atmosphere;
        }

        getStdYCoeffs(x) {
            let index;
            let coeffs = STD_Y_COEFFS[this.atmosphere.getGrade()];
            if (x < 10000) {
                index = 0;
            } else {
                index = 1;
            }
            return coeffs[index];
        }

        getStdY(x) {
            let coeffs = this.getStdYCoeffs(x);
            return coeffs.c * Math.pow(x, coeffs.d);
        }

        getStdZCoeffs(x) {
            let coeffs = STD_Z_COEFFS[this.atmosphere.getGrade()];
            let index;
            if (x < 500) {
                index = 0;
            } else if (x < 5000) {
                index = 1;
            } else {
                // 5000 < x
                index = 2;
            }
            return coeffs[index];
        }

        getStdZ(x) {
            let coeffs = this.getStdZCoeffs(x);
            return coeffs.a * Math.pow(x, coeffs.b);
        }
        
        getWindSpeedAtSourceHeight() {
            return this.atmosphere.getWindSpeedAt(this.getEffectiveSourceHeight());
        }
        
        getMaxRise(x, ambientTemp, sourceTemp, stackExitVel, stackRad) {
            // @see page 31
            // Grades 1 - 5 are assumed unstable/neutral, 6 - 7 are assumed stable
            // Both the momentum dominated and buoyancy dominated methods should be calculated, then use the max
            let bDeltaH, mDeltaH; // Max plume rise buoyancy, momentum dominated resp.
            const g = 9.8; // gravity (m/s^2)
            const F = g * stackExitVel * Math.pow(stackRad, 2) * (sourceTemp - ambientTemp) / sourceTemp;
            const U = this.getWindSpeedAtSourceHeight(); // wind speed at stack height
            
            if (this.atmosphere.getGrade() <= 5) {
                // unstable/neutral
                // Gets super funky, ugh science
                let xStar = F < 55 ? 14 * Math.pow(F, 0.625) : 34 * Math.pow(F, .4);
                if (x > 3.5 * xStar) {
                    x = xStar;
                }
                bDeltaH = 1.6 * Math.pow(F, .333) * Math.pow(3.5 * x, .667) * Math.pow(U, -1);
                mDeltaH = (3 * stackExitVel * (2 * stackRad)) / U;
            } else {
                // stable
                const s = this.atmosphere.getLetterGrade() === 'E' ? 0.018: 0.025; //  g/ambientTemp
                bDeltaH = 2.6 * Math.pow(F / (U * s), .333);
                mDeltaH = 1.5 * Math.pow(stackExitVel * stackRad, .667) * Math.pow(U, -0.333) * Math.pow(s, -0.166);
            }
            
            console.log("bDeltaH: " + bDeltaH);
            console.log("mDeltaH: " + mDeltaH);
            // Return the max
            if (bDeltaH > mDeltaH) {
                console.log("Buoyancy dominated.");
                return bDeltaH;
            }
            console.log("Momentum dominated.");
            return mDeltaH;
        }

        setEffectiveSourceHeight(height) {
            this.effSrcHeight = height;
            return this;
        }
        /* Should potentially move this to the Source class */
        getEffectiveSourceHeight() {
            if (this.effSrcHeight) {
                return this.effSrcHeight;
            }
            let deltaH = this.getMaxRise(
                0,  // Shouldn't this be from 0 i.e. the origin?
                this.atmosphere.getTemperature(),
                this.source.getTemperature(),
                this.source.getExitVelocity(),
                this.source.getRadius()
            );
            this.effSrcHeight = this.source.getHeight() + deltaH;
            return this.effSrcHeight;
        }
        
        getMaxConcentration() {
            let x = this.getMaxConcentrationX();
            let stdY = this.getStdY(x);
            let stdZ = this.getStdZ(x);
            let H = this.getEffectiveSourceHeight();

            let a = (this.source.getEmissionRate() * 1000000) / (Math.PI * stdY * stdZ * this.getWindSpeedAtSourceHeight());
            let b = Math.exp((-0.5) * Math.pow(H / stdZ, 2));

            return a * b;
        }
        
        getMaxConcentrationX() {
            // If unknown, set x to 5000 meters
            let stdYCoeffs = this.getStdYCoeffs(5000);  // c , d
            let stdZCoeffs = this.getStdZCoeffs(5000);  // a , b
            let H = this.getEffectiveSourceHeight();

            let pt1 = (stdZCoeffs.b * Math.pow(H, 2)) / (Math.pow(stdZCoeffs.a, 2) * (stdYCoeffs.d + stdZCoeffs.b));
            return Math.pow(pt1, (1 / (2 * stdZCoeffs.b)));
        }

        /**
         *
         * @param x {number} Meters downwind of source, greater than 0
         * @param y {number} Meters crosswind of source
         * @param z {number} Meters vertical of ground
         * @returns {number} micrograms / cubic meter
         */
        getConcentration(x, y, z) {
            // First part of Gaussian equation 1 found on page 2
            let stdY = this.getStdY(x);
            let stdZ = this.getStdZ(x);
            // Effective stack height
            let H = this.getEffectiveSourceHeight();

            let a = this.source.emissionRate /
                (2 * Math.PI * stdY * stdZ * this.getWindSpeedAtSourceHeight());
            let b = Math.exp(-1 * Math.pow(y, 2) / (2 * Math.pow(stdY, 2)));
            let c = Math.exp(-1 * Math.pow(z - H, 2) / (2 * Math.pow(stdZ, 2)));
            let d = Math.exp(-1 * Math.pow(z + H, 2) / (2 * Math.pow(stdZ, 2)));
            
            // Put it all together! get
            return a * b * (c + d);
        }

        /**
         * Calculates the stdY, stdZ, and concentrations for a list of x coordinates
         *  directly downwind of the source
         * Useful in creating graphs / processing large amounts of data at once
         * @param xs {Array} a list of x's
         * @returns {Array} a list of stats
         */
        getStatsForXs(xs) {
            var stats = [];
            for (let i = 0; i < xs.length; i++) {
                stats.push({
                    x: xs[i],
                    y: 0,
                    z: 0,
                    stdY: this.getStdY(xs[i]),
                    stdZ: this.getStdZ(xs[i]),
                    concentration: this.getConcentration(xs[i], 0, 0)
                })
            }
            return stats;
        }

        /**
         * Same as getStatsForXs, but for 3d coordinates
         * @param coords {Array} a list of objects with x,y,z params
         * @returns {Array}
         */
        getStatsForCoords(coords) {
            var stats = [];
            for (let i = 0; i < coords.length; i++) {
                stats.push({
                    x: coords[i].x,
                    y: coords[i].y,
                    z: coords[i].z,
                    stdY: this.getStdY(xs[i]),
                    stdZ: this.getStdZ(xs[i]),
                    concentration: this.getConcentration(coords[i].x, coords[i].y, coords[i].z)
                })
            }
            return stats;
        }
    }

    const Dirtybomb = {};

    Dirtybomb.GaussianPlume = GaussianPlume;
    Dirtybomb.Atmosphere = Atmosphere;
    Dirtybomb.Source = Source;
    Dirtybomb.SourceType = SourceType;

    return Dirtybomb;

}));