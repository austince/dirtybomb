/**
 * Created by austin on 6/2/16.
 * file: GaussianPlume.js
 * 
 * A model of a Gaussian Plume based on this lecture:
 * http://dept.ceer.utexas.edu/ceer/che357/PDF/Lectures/gaussian_plume_modeling.pdf
 * All equations used can be found within.
 * 
 * Assumes:
 * Daytime
 * Urban Areas
 * Single point source
 *
 * These will be accounted for later if this is not a waste of time.
 */

"use strict";

import Source, {
    SourceType
} from './Source';
import Atmosphere from './Atmosphere';

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
        return this._source.toString() + " in " + this._atmosphere.toString();
    }

    addSource(source) {
        this._source = source;
        return this;
    }
    getSource() {
        return this._source;
    }

    /**
     * 
     * @param atmosphere {Atmosphere}
     */
    setAtmosphere(atmosphere) {
        this._atmosphere = atmosphere;
        return this;
    }
    getAtmosphere() {
        return this._atmosphere;
    }

    getStdYCoeffs(x) {
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
     * @param x
     * @returns {number}
     */
    getStdY(x) {
        let coeffs = this.getStdYCoeffs(x);
        return coeffs.c * Math.pow(x, coeffs.d);
    }

    getStdZCoeffs(x) {
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
     * @param x
     * @returns {number}
     */
    getStdZ(x) {
        let coeffs = this.getStdZCoeffs(x);
        return coeffs.a * Math.pow(x, coeffs.b);
    }
    
    getWindSpeedAtSourceHeight() {
        return this._atmosphere.getWindSpeedAt(this.getEffectiveSourceHeight());
    }

    /**
     * 
     * @param x , distance (m) downwind
     * @returns {number}
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
        const g = 9.8; // gravity (m/s^2)
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

    setEffectiveSourceHeight(height) {
        this.effSrcHeight = height;
        return this;
    }
    /* Should potentially move this to the Source class */
    getEffectiveSourceHeight() {
        if (this.effSrcHeight) {
            return this.effSrcHeight;
        }
        let deltaH = this.getMaxRise(0);
        this.effSrcHeight = this._source.getHeight() + deltaH;
        return this.effSrcHeight;
    }
    
    getMaxConcentration() {
        let x = this.getMaxConcentrationX();
        let stdY = this.getStdY(x);
        let stdZ = this.getStdZ(x);
        let H = this.getEffectiveSourceHeight();

        let a = (this._source.getEmissionRate() * 1000000) / (Math.PI * stdY * stdZ * this.getWindSpeedAtSourceHeight());
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
     * @param x {number} Meters downwind of _source, greater than 0
     * @param y {number} Meters crosswind of _source
     * @param z {number} Meters vertical of ground
     * @returns {number} grams / cubic meter
     */
    getConcentration(x, y, z) {
        // First part of Gaussian equation 1 found on page 2
        let stdY = this.getStdY(x);
        let stdZ = this.getStdZ(x);
        // Effective stack height
        let H = this.getEffectiveSourceHeight();

        let a = this._source.emissionRate /
            (2 * Math.PI * stdY * stdZ * this.getWindSpeedAtSourceHeight());
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

export { SourceType }
export { Source };
export { Atmosphere };
export default GaussianPlume;