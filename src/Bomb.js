/**
 * Created by austin on 6/17/16.
 */

import Atmosphere from './Dispersion/Atmosphere';
import Source, {
    SourceType
} from './Dispersion/Source';
import GaussianPuff from './Dispersion/GaussianPuff';

/**
 * Explosive energy of tnt
 * MJ/kg
 * @type {number}
 */
const Q_TNT = 4.19;

class Bomb {
    /**
     *
     * @param {number} tntEqvMass
     * @param {Atmosphere} [atmosphere=Bomb.STANDARD_ATM]
     */
    constructor(tntEqvMass, atmosphere = Bomb.STANDARD_ATM) {
        /**
         *
         * @type {number}
         * @private
         */
        this._mass = tntEqvMass;
        /**
         * A standardized measure for weapon strength
         * @type {number}
         * @private
         */
        this._weaponYield = tntEqvMass / 1000000;
        /**
         *
         * @type {Atmosphere}
         * @private
         */
        this._atm = atmosphere;

        /**
         * 
         * @type {Source}
         * @private
         */
        this._source = new Source(
            SourceType.POINT,
            Math.POSITIVE_INFINITY, // Emission rate, arb for puffs. TODO!
            this.cloudHeight,
            this.cloudRadius,
            this.getGasTemp(this.cloudHeight),
            this.getGasVelocity(this.cloudHeight)
        );
        
        this._puff = new GaussianPuff(
            atmosphere,
            this._source,
            this.mass // Todo: how to calculate how much mass goes into the air?
        );
        
        if (this.weaponYield > 1000) {
            console.warn("WARNING: this bomb library is mean for bombs weaponYields under 1000.");
        }
    }

    /**
     *
     * @param atm
     * @returns {Bomb}
     */
    setAtmosphere(atm) {
        this._atm = atm;
        return this;
    }

    /**
     *
     * @returns {Atmosphere}
     */
    get atmosphere() {
        return this._atm;
    }

    get weaponYield() {
        return this._weaponYield;
    }
    
    get source() {
        return this._source;
    }

    /**
     *
     * @param mass
     * @returns {Bomb}
     */
    setMass(mass) {
        this._mass = mass;
        return this;
    }

    /**
     *
     * @returns {number}
     */
    get mass() {
        return this._mass;
    }

    /**
     * Based on kilotons of tnt nuclear explosions
     * @returns {number}
     */
    get blastRadius() {
        return 30 * Math.pow(this.weaponYield, 1/3);
    }

    /**
     * From eq 7 of CISAC Fallout Model
     * Approximating this as the top of the stem cloud
     * Perhaps will change this as a combination of all three cloud alt equations
     * @see http://cisac.fsi.stanford.edu/sites/default/files/geist_2014_cv.pdf
     * @returns {number}
     */
    get cloudHeight() {
        if (this.weaponYield < 2) {
            return 1740 * Math.pow(this.weaponYield, 0.229);
        }
        if (this.weaponYield < 20) {
            return 1720 * Math.pow(this.weaponYield, 0.261);
        }
        return 2040 * Math.pow(this.weaponYield, 0.204);
    }

    /**
     * Should not be used in this context. Really for nuclear bombs.
     * @returns {number}
     * @private
     */
    _getMainCloudRadius() {
        return 872 * Math.pow(this.weaponYield, 0.427);
    }

    get cloudRadius() {
        let mainRad = this._getMainCloudRadius();
        if (this.weaponYield < 20) {
            return 0.5 * mainRad;
        }
        if (this.weaponYield <= 1000) {
            return 0.5 * mainRad - 0.3 * mainRad * ((this.weaponYield - 20) / 980);
        }
        return 0.2 * mainRad - 0.1 * mainRad * ((this.weaponYield - 1000) / 9000);
    }


    get dispersion() {
        return this._puff;
    }

    /**
     * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/ equation 3
     * @param {number} r - distance from origin (m)
     * @returns {number} - pressure (atm)
     */
    getOverpressureAt(r) {
        let a = (0.84 / r) * Math.pow(this._mass, (1/3));
        let b = (2.7 / Math.pow(r, 2)) * Math.pow(this.mass, (2/3));
        let c = (7 / Math.pow(r, 3)) * this.mass;
        return a + b + c;
    }

    /**
     * Velocity of gas in behind shock wave front
     * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/ equation 5.2
     * @param {number} r - distance from origin (m)
     * @returns {number} velocity (m/s)
     */
    getGasVelocity(r) {
        let pressure = this.getOverpressureAt(r);
        // Simplified for standard atmosphere
        return 243 * pressure / Math.sqrt(1 + 0.86 * pressure);
    }

    /**
     * Temperature of gas in shock wave front
     * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/ equation 5.3
     * @param {number} r - distance from origin (m)
     * @returns {number} temperature (K)
     */
    getGasTemp(r) {
        let pressure = this.getOverpressureAt(r);
        return this.atmosphere.getTemperature() * (1 + pressure) * (7 + pressure) / (7 + 6 * pressure);
    }

    /**
     * Positive Shock Phase Duration
     * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/ equation 4
     * @param {number} r - distance from origin (m)
     * @returns {number} duration (s)
     */
    getPosShockPhaseDuration(r) {
        return 1.3 * Math.pow(this.mass, (1 / 6)) * Math.sqrt(r) * 0.001;
    }

    /**
     * 
     * @param {number} qExp - explosive energy (MJ/kg)
     * @returns {number}
     */
    static tntEquivalentFactor(qExp) {
        return qExp / Q_TNT;
    }

    /**
     * 
     * @param {number} qExp - explosive energy (MJ/kg)
     * @param {number} mass - (kg)
     * @returns {number}
     */
    static tntEquivalent(qExp, mass) {
        return Bomb.tntEquivalentFactor(qExp) * mass;
    }
}

/**
 * Should probably move this to the Atmosphere class
 * 0 wind
 * 0 sky cover
 * 65 degrees sun
 * 59 degrees F / 15 degrees C
 * @type {Atmosphere}
 */
Bomb.STANDARD_ATM = new Atmosphere(0, 0, 65, 288.2);

export default Bomb;