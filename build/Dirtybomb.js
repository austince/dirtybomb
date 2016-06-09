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

    /**
     * Where the contaminate comes from !
     */
    class Source {
        
        /**
         * 
         * @param {SourceType} type - The type of source 
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
             */
            this.type = type;
            /**
             * 
             * @type {number}
             */
            this.temp = temperature;
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
            return "Emission rate of " + this.emissionRate + " g/s";
        }

        /**
         * 
         * @returns {number|*}
         */
        getEmissionRate() {
            return this.emissionRate;
        }

        /**
         * 
         * @returns {number|*}
         */
        getHeight() {
            return this.height;
        }

        /**
         * 
         * @returns {number|*}
         */
        getRadius() {
            return this.radius;
        }

        /**
         * 
         * @returns {SourceType|*}
         */
        getType() {
            return this.type;
        }

        /**
         * 
         * @returns {number|*}
         */
        getTemperature() {
            return this.temp;
        }

        /**
         * 
         * @returns {number|*}
         */
        getExitVelocity() {
            return this.exitVel;
        }
    }

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
     * [skyCover > .5, skyCover < .5]
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
         * Only windSpeed, skyCover, and solarElevation are required.
         * Temperature is required when not setting effective source height manually
         * The default is urban daytime.
         * @param {number} windSpeed at ground level (m/s)
         * @param {number} skyCover a percentage 0-1
         * @param {number} solarElevation (degrees)
         * @param {number} temperature (Kelvin)
         * @param {string} [setting="urban"]
         * @param {boolean} [isNight=false] - Can change this to a Date, but should be simple enough to keep track of for the user
         *          1 hour before sunset and 1 hour past sunrise
         */
        constructor(windSpeed, skyCover, solarElevation, temperature, setting = "urban", isNight = false) {
            /**
             * 
             * @type {number}
             */
            this.windSpeed = windSpeed;
            /**
             * 
             * @type {number}
             */
            this.skyCover = skyCover;
            /**
             * 
             * @type {number}
             */
            this.solarElevation = solarElevation;
            /**
             * 
             * @type {number}
             */
            this.temp = temperature;
            /**
             * 
             * @type {string}
             */
            this.setting = setting;
            /**
             * 
             * @type {boolean}
             * @private
             */
            this._isNight = isNight;
            //this.grade = Atmosphere.calculateGrade(skyCover, solarElevation, windSpeed);
        }

        /**
         * 
         * @returns {string}
         */
        toString() {
            return "Grade: " + this.getLetterGrade() +
                " Wind at " + this.windSpeed + " m/s," +
                " Sun at " + this.solarElevation + " degrees";
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

        /**
         * 
         * @returns {number|*} m/s
         */
        getWindSpeed() {
            return this.windSpeed;
        }

        /**
         * The percentage of the sky is covered
         * @param {number} cover - 0 - 1
         * @returns {Atmosphere}
         */
        setSkyCover(cover) {
            this.skyCover = cover;
            return this;
        }

        /**
         * 
         * @returns {number|*}
         */
        getSkyCover() {
            return this.skyCover;
        }

        /**
         * 
         * @param {number} elevation - degrees 
         * @returns {Atmosphere}
         */
        setSolarElevation(elevation) {
            this.solarElevation = elevation;
            return this;
        }

        /**
         * 
         * @returns {number|*} degrees
         */
        getSolarElevation() {
            return this.solarElevation;
        }

        /**
         * 
         * @param {number} temp - Kelvin
         * @returns {Atmosphere}
         */
        setTemperature(temp) {
            this.temp = temp;
            return this;
        }

        /**
         * 
         * @returns {number|*} Kelvin
         */
        getTemperature() {
            return this.temp;
        }

        /**
         * 
         * @param {string} setting - Either "rural" or "urban"
         * @returns {Atmosphere}
         */
        setSetting(setting) {
            this.setting = setting;
            return this;
        }

        /**
         * 
         * @returns {string}
         */
        getSetting() {
            return this.setting;
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
        isNight() {
            return this._isNight;
        }
        
        /**
         * Adjusts wind speed to a specific height. Approximation.
         * @param {number} height - m
         * @returns {number} The approx. wind speed at a specified height above the ground (m/s)
         */
        getWindSpeedAt(height) {
            // Assumes ground wind speed was measured at 10m
            let windProfile = this.setting === 'urban' ? 
                WIND_PROFILES[this.getGrade()].urban : WIND_PROFILES[this.getGrade()].rural;
            return this.windSpeed * Math.pow((height / 10), windProfile);
        }
    }

    /**
     * @typedef {Object} Stat
     * @property {number} x - meters downwind
     * @property {number} y - meters crosswind
     * @property {number} z - meters vertical
     * @property {number} stdY
     * @property {number} stdZ
     * @property {number} concentration - micrograms / cubic meter
     */

    /**
     * @typedef {Object} Coord
     * @property {number} x - meters downwind 
     * @property {number} y - meters crosswind 
     * @property {number} z - meters vertical 
     */

    /**
     * @typedef {Object} STD_Y_COEFF
     * @property {number} c
     * @property {number} d
     */
    /**
     * 0 - 6 for atm stab grade
     * [x < 10000, x >= 10000]
     *  @type {STD_Y_COEFF}
     */
    const STD_Y_COEFFS = [
        [{c: .495, d: .873}, {c: .606, d: .851}],
        [{c: .310, d: .897}, {c: .523, d: .840}],
        [{c: .197, d: .908}, {c: .285, d: .867}],
        [{c: .122, d: .916}, {c: .193, d: .865}],
        [{c: .122, d: .916}, {c: .193, d: .865}],
        [{c: .0934, d: .912}, {c: .141, d: .868}],
        [{c: .0625, d: .911}, {c: .0800, d: .884}]
    ];

    /**
     * @typedef {Object} STD_Z_COEFF
     * @property {number} a
     * @property {number} b
     */
    /** 
     * [x < 500, 500 <= x < 5000, 5000 <= x]
     * @type {STD_Z_COEFF}
     */
    const STD_Z_COEFFS = [
        [{a: .0383, b: 1.281}, {a: .0002539, b: 2.089}, {a: .0002539, b: 2.089}],
        [{a: .1393, b: .9467}, {a: .04936, b: 1.114}, {a: .04936, b: 1.114}],
        [{a: .1120, b: .9100}, {a: .1014, b: .926}, {a: .1154, b: .9106}],
        [{a: .0856, b: .8650}, {a: .2591, b: .6869}, {a: .7368, b: .5642}],
        [{a: .0818, b: .8155}, {a: .2527, b: .6341}, {a: 1.297, b: .4421}],
        [{a: .1064, b: .7657}, {a: .2452, b: .6358}, {a: .9024, b: .4805}],
        [{a: .05645, b: .8050}, {a: .1930, b: .6072}, {a: 1.505, b: .3662}]
    ];

    // gravity (m/s^2)

    /**
     * A Simple Gaussian Plume. For resources, please see the github repo.
     * Calculates spread for one hour with constant conditions.
     * 
     * http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf
     */
    class GaussianPlume {

        /**
         * For now, each Plume contains a constant atmosphere and a single Source
         * @param {Atmosphere} atmosphere
         * @param {Source} source
         */
        constructor(atmosphere, source) {
            this.setAtmosphere(atmosphere);
            this.addSource(source);
        }

        /**
         * @override
         * @returns {string}
         */
        toString() {
            return '${this._source.toString()} in ${this._atmosphere.toString()}';
        }

        /**
         * Adds a single source to the plume
         * @param {Source} source
         * @returns {GaussianPlume} For chaining purposes
         */
        addSource(source) {
            this._source = source;
            return this;
        }

        /**
         * 
         * @returns {Source|*}
         */
        getSource() {
            return this._source;
        }

        /**
         * @type {Atmosphere}
         * @param {Atmosphere} atmosphere
         * @returns {GaussianPlume} For chaining purposes
         */
        setAtmosphere(atmosphere) {
            this._atmosphere = atmosphere;
            return this;
        }

        /**
         * @type {Atmosphere}
         * @returns {Atmosphere|*}
         */
        getAtmosphere() {
            return this._atmosphere;
        }

        /**
         * A helper function for the StdZ calculation
         * @private
         * @param {number} x - distance downwind (m)
         * @returns {STD_Y_COEFF}
         */
        _getStdYCoeffs(x) {
            let index;
            let coeffs = STD_Y_COEFFS[this._atmosphere.getGrade()];
            if (x < 10000) {
                index = 0;
            } else {
                index = 1;
            }
            return coeffs[index];
        }

        /**
         * The crosswind distance standard deviation for a distance x downwind.
         * To be used in a Gaussian distribution
         * @param {number} x - distance downwind (m)
         * @returns {number} crosswind standard deviation at x meters downwind (m)
         */
        getStdY(x) {
            let coeffs = this._getStdYCoeffs(x);
            return coeffs.c * Math.pow(x, coeffs.d);
        }

        /**
         * A helper function for the StdZ calculation
         * @private
         * @param {number} x - distance downwind (m)
         * @returns {STD_Z_COEFF}
         */
        _getStdZCoeffs(x) {
            let coeffs = STD_Z_COEFFS[this._atmosphere.getGrade()];
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

        /**
         * The vertical distance standard deviation for a distance x downwind.
         * To be used in a Gaussian distribution
         * @param {number} x - distance downwind (m)
         * @returns {number}
         */
        getStdZ(x) {
            let coeffs = this._getStdZCoeffs(x);
            return coeffs.a * Math.pow(x, coeffs.b);
        }

        /**
         * 
         * @returns {number} m/s
         */
        getWindSpeedAtSourceHeight() {
            return this._atmosphere.getWindSpeedAt(this.getEffectiveSourceHeight());
        }

        /**
         * Manually set the Effective Source Height
         * @param {number} height 
         * @returns {GaussianPlume} For chaining purposes
         */
        setEffectiveSourceHeight(height) {
            this._effSrcHeight = height;
            return this;
        }
        /**
         *  Takes into account the wind and other factors into account.
         *  Should potentially move this to the Source class
         *  @returns {number} the effective source height
         *  */
        getEffectiveSourceHeight() {
            if (this._effSrcHeight) {
                return this._effSrcHeight;
            }
            let deltaH = this.getMaxRise(0);
            this._effSrcHeight = this._source.getHeight() + deltaH;
            return this._effSrcHeight;
        }

        getMeanHeight(x) {
            // Should use integrals but need to research how to load a nicer math library in hur

            // For large x this should be ok, between 0 (ground) and maxPlumeRise
            return this.getMaxRise(x) / 2;
        }

        /**
         * The max rise of the plume at x meters downwind
         * @param {number} x - distance (m) downwind
         * @returns {number} vertical standard deviation at x meters downwind (m)
         */
        getMaxRise(x) {
            // @see page 31
            // Grades 1 - 5 are assumed unstable/neutral, 6 - 7 are assumed stable
            // Both the momentum dominated and buoyancy dominated methods should be calculated, then use the max
            let bDeltaH, mDeltaH; // Max plume rise buoyancy, momentum dominated resp.
            const srcRad = this._source.getRadius();
            const srcTemp = this._source.getTemperature();
            const srcHeight = this._source.getHeight();
            const srcExitVel = this._source.getExitVelocity();
            const ambTemp = this._atmosphere.getTemperature();
            const F = g * srcExitVel * Math.pow(srcRad, 2) * (srcTemp - ambTemp) / srcTemp;
            const U = this._atmosphere.getWindSpeedAt(srcHeight); // wind speed at stack height

            if (this._atmosphere.getGrade() <= 5) {
                // unstable/neutral
                // Gets super funky, ugh science

                // Distance to Maximum Plume Rise
                let xStar = F < 55 ? 14 * Math.pow(F, 0.625) : 34 * Math.pow(F, .4);
                // Will use 0 if calculating from the _source. Need to read more about this.
                if (x == 0 || x > 3.5 * xStar) {
                    x = xStar;
                }
                bDeltaH = 1.6 * Math.pow(F, .333) * Math.pow(3.5 * x, .667) * Math.pow(U, -1);
                mDeltaH = (3 * srcExitVel * (2 * srcRad)) / U;
            } else {
                // stable
                const s = this._atmosphere.getLetterGrade() === 'E' ? 0.018: 0.025; //  g/ambientTemp
                bDeltaH = 2.6 * Math.pow(F / (U * s), .333);
                mDeltaH = 1.5 * Math.pow(srcExitVel * srcRad, .667) * Math.pow(U, -0.333) * Math.pow(s, -0.166);
            }

            // console.log("bDeltaH: " + bDeltaH);
            // console.log("mDeltaH: " + mDeltaH);
            // Return the max
            if (bDeltaH > mDeltaH) {
                // console.log("Buoyancy dominated.");
                return bDeltaH;
            }
            // console.log("Momentum dominated.");
            return mDeltaH;
        }

        /**
         * Calculates the maximum concentration dispersed
         * @returns {number} micrograms / cubic meters
         */
        getMaxConcentration() {
            let x = this.getMaxConcentrationX();
            let stdY = this.getStdY(x);
            let stdZ = this.getStdZ(x);
            let H = this.getEffectiveSourceHeight();

            let a = (this._source.getEmissionRate() * 1000000) / (Math.PI * stdY * stdZ * this.getWindSpeedAtSourceHeight());
            let b = Math.exp((-0.5) * Math.pow(H / stdZ, 2));

            return a * b;
        }

        /**
         * Calculates the distance downwind of the maximum concentration
         * @returns {number} micrograms / cubic meter
         */
        getMaxConcentrationX() {
            // If unknown, set x to 5000 meters
            let stdYCoeffs = this._getStdYCoeffs(5000);  // c , d
            let stdZCoeffs = this._getStdZCoeffs(5000);  // a , b
            let H = this.getEffectiveSourceHeight();

            let pt1 = (stdZCoeffs.b * Math.pow(H, 2)) / (Math.pow(stdZCoeffs.a, 2) * (stdYCoeffs.d + stdZCoeffs.b));
            return Math.pow(pt1, (1 / (2 * stdZCoeffs.b)));
        }

        /**
         * Calculates the concentration at a given x,y,z coordinate.
         * Must be downwind
         * @param {number} x - Meters downwind of _source, greater than 0
         * @param {number} y - Meters crosswind of _source
         * @param {number} z - Meters vertical of ground
         * @returns {number} micrograms / cubic meter
         *
         * @example
         * getConcentration(200, 300, 10)
         * Calculates at 200 meters downwind, 300 east, 10 high
         */
        getConcentration(x, y, z) {
            // First part of Gaussian equation 1 found on page 2
            let stdY = this.getStdY(x);
            let stdZ = this.getStdZ(x);
            // Effective stack height
            let H = this.getEffectiveSourceHeight();
            let U = this.getWindSpeedAtSourceHeight();

            let a = this._source.emissionRate / (2 * Math.PI * stdY * stdZ * U);
            let b = Math.exp(-1 * Math.pow(y, 2) / (2 * Math.pow(stdY, 2)));
            let c = Math.exp(-1 * Math.pow(z - H, 2) / (2 * Math.pow(stdZ, 2)));
            let d = Math.exp(-1 * Math.pow(z + H, 2) / (2 * Math.pow(stdZ, 2)));
            
            // Put it all together! get
            return a * b * (c + d);
        }

        /**
         * Calculates the stdY, stdZ, and concentrations for a list of x coordinates
         *  directly downwind of the _source
         * Useful in creating graphs / processing large amounts of data at once
         * @param {number[]} xs - a list of x's
         * @returns {Stat[]} a list of stats
         */
        getStatsForXs(xs) {
            let stats = [];
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
         * @param {Coord[]} coords - a list of objects with x,y,z params
         * @returns {Stat[]}
         */
        getStatsForCoords(coords) {
            let stats = [];
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

    /*
    * Understanding Radioactive Aerosols and Their Measurement
    * https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
    * 
    * */

    /**
     * An extension (surprise surprise) on the Gaussian Plume to account for radioactive materials
     */
    class GaussianDecayPlume extends GaussianPlume {

        /**
         * @override
         * @param {Atmosphere} atmosphere
         * @param {Source} source
         * @param {number} halfLife - seconds
         */
        constructor(atmosphere, source, halfLife) {
            super(atmosphere, source);
            this._halfLife = halfLife; // Usually the half-life of the pollutant
            this._decayCoeff = 0.693 / halfLife;
        }

        /**
         * 
         * @returns {number|*}
         */
        getHalfLife() {
            return this._halfLife;
        }
        
        /**
         * Read URAaTM pg 281 - 285
         * @param {number} x - downwind distance (m)
         * @param {number} windSpeed - at source height (m/s)
         * @returns {number} Decay term
         */
        getDecayTerm(x, windSpeed) {
            if (this._decayCoeff == 0) {
                return 1;
            } else {
                return Math.exp(- this._decayCoeff * (x / windSpeed));
            }
        }

        /**
         * Takes into account the decay term, as seen in URAaTM pg 281
         * Overridden from super class
         * @override
         * @param {number} x
         * @param {number} y
         * @param {number} z
         */
        getConcentration(x, y, z) {
            let unDecayed = super.getConcentration(x, y, z);
            let decayTerm = this.getDecayTerm(x, this.getAtmosphere().getWindSpeed());
            return unDecayed * decayTerm;
        }
    }

    /**
     * Everything is exported through the Dirtybomb object
     * Potentially going to export Gaussian Plumes as their own modules
     * @type {Object}
     */
    const Dirtybomb = {};

    Dirtybomb.GaussianPlume = GaussianPlume;
    Dirtybomb.GaussianDecayPlume = GaussianDecayPlume;
    Dirtybomb.Atmosphere = Atmosphere;
    Dirtybomb.Source = Source;
    Dirtybomb.SourceType = SourceType;

    return Dirtybomb;

}));