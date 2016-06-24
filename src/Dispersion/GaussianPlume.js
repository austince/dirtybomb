/**
 * Created by austin on 6/6/16.
 * @file GaussianPlume.js
 * Assumes:
 * Single point source
 */

"use strict";

import Source, {
    SourceType
} from './Source';
import Atmosphere from './Atmosphere';

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

const G = 9.8; // gravity (m/s^2)

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

        /**
         *
         * @type {number}
         * @private
         */
        this._manualEffSrcHeight;
    }

    /**
     * @override
     * @returns {string}
     */
    toString() {
        return '${this.source.toString()} in ${this._atm.toString()}';
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
     * @returns {Source}
     */
    get source() {
        return this._source;
    }

    /**
     * @param {Atmosphere} atmosphere
     * @returns {GaussianPlume} For chaining purposes
     */
    setAtmosphere(atmosphere) {
        this._atm = atmosphere;
        return this;
    }

    /**
     * @returns {Atmosphere}
     */
    get atmosphere() {
        return this._atm;
    }

    /**
     * A helper function for the StdZ calculation
     * @protected
     * @param {number} x - distance downwind (m)
     * @returns {STD_Y_COEFF}
     */
    _getStdYCoeffs(x) {
        let index;
        let coeffs = STD_Y_COEFFS[this._atm.getGrade()];
        if (x < 10000) {
            index = 0;
        } else {
            index = 1;
        }
        return coeffs[index];
    }

    /**
     * Brookhaven sigma
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
     * @protected
     * @param {number} x - distance downwind (m)
     * @returns {STD_Z_COEFF}
     */
    _getStdZCoeffs(x) {
        let index;
        let coeffs = STD_Z_COEFFS[this._atm.getGrade()];
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
     * Brookhaven sigma
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
    get windSpeedAtSourceHeight() {
        return this._atm.getWindSpeedAt(this.effectiveSourceHeight);
    }

    /**
     * Manually set the Effective Source Height
     * @param {number} height 
     * @returns {GaussianPlume} For chaining purposes
     */
    setEffectiveSourceHeight(height) {
        this._manualEffSrcHeight = height;
        return this;
    }
    /**
     *  Takes into account the wind and other factors into account.
     *  Should potentially move this to the Source class
     *  @returns {number} the effective source _height
     *  */
    get effectiveSourceHeight() {
        // If there has been a manually set source height
        // Causes problems if the plume is dynamic
        if (this._manualEffSrcHeight) {
            return this._effSrcHeight;
        }
        let deltaH = this.getMaxRise(0);
        this._effSrcHeight = this.source.height + deltaH;
        return this._effSrcHeight;
    }

    /**
     * 
     * @param x
     * @returns {number}
     */
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
        const srcRad = this.source.radius;
        const srcTemp = this.source.temperature;
        const srcHeight = this.source.height;
        const srcExitVel = this.source.exitVelocity;
        const ambTemp = this._atm.temperature;
        const F = G * srcExitVel * Math.pow(srcRad, 2) * (srcTemp - ambTemp) / srcTemp;
        const U = this._atm.getWindSpeedAt(srcHeight); // wind speed at stack _height

        if (this._atm.getGrade() <= 5) {
            // unstable/neutral
            // Gets super funky, ugh science

            // Distance to Maximum Plume Rise
            let xStar = F < 55 ? 14 * Math.pow(F, 0.625) : 34 * Math.pow(F, .4);
            // Will use 0 if calculating from the source. Need to read more about this.
            if (x == 0 || x > 3.5 * xStar) {
                x = xStar;
            }
            bDeltaH = 1.6 * Math.pow(F, .333) * Math.pow(3.5 * x, .667) * Math.pow(U, -1);
            mDeltaH = (3 * srcExitVel * (2 * srcRad)) / U;
        } else {
            // stable
            const s = this._atm.letterGrade === 'E' ? 0.018: 0.025; //  g/ambientTemp
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
    get maxConcentration() {
        let x = this.maxConcentrationX;
        let stdY = this.getStdY(x);
        let stdZ = this.getStdZ(x);
        let H = this.effectiveSourceHeight;

        let a = (this.source.emissionRate * 1000000) / (Math.PI * stdY * stdZ * this.windSpeedAtSourceHeight);
        let b = Math.exp((-0.5) * Math.pow(H / stdZ, 2));

        return a * b;
    }

    /**
     * Calculates the distance downwind of the maximum concentration
     * @returns {number} micrograms / cubic meter
     */
    get maxConcentrationX() {
        // If unknown, set x to 5000 meters
        let stdYCoeffs = this._getStdYCoeffs(5000);  // c , d
        let stdZCoeffs = this._getStdZCoeffs(5000);  // a , b
        let H = this.effectiveSourceHeight;

        let pt1 = (stdZCoeffs.b * Math.pow(H, 2)) / (Math.pow(stdZCoeffs.a, 2) * (stdYCoeffs.d + stdZCoeffs.b));
        return Math.pow(pt1, (1 / (2 * stdZCoeffs.b)));
    }

    /**
     * Calculates the concentration at a given x,y,z coordinate.
     * Must be downwind
     * @param {number} x - Meters downwind of source, greater than 0
     * @param {number} y - Meters crosswind of source
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
        // Effective stack _height
        let H = this.effectiveSourceHeight;
        let U = this.windSpeedAtSourceHeight;

        let a = this.source.emissionRate / (2 * Math.PI * stdY * stdZ * U);
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

export { SourceType }
export { Source };
export { Atmosphere };
export default GaussianPlume;