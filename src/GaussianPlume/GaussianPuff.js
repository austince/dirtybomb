/**
 * Created by austin on 6/8/16.
 */
    
import GaussianPlume from './GaussianPlume';
import {integrate} from './utils';


const GAS_CONSTANT = 8.3144598;

/**
 * Models a discrete release
 * http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf pg 17
 */
class GaussianPuff extends GaussianPlume {

    /**
     *
     * @param {Atmosphere} atmosphere
     * @param {Source} source
     * @param {number} massReleased
     * @param {number} molarMass
     */
    constructor(atmosphere, source, massReleased, molarMass, samplingTime = 1) {
        super(atmosphere, source);
        /**
         * @type {number}
         * @private
         */
        this._massReleased = massReleased;
        /**
         * @type {number}
         * @private
         */
        this._molarMass = molarMass;
        /**
         *
         * @type {number}
         * @private
         */
        this._samplingTime = samplingTime;
    }

    /**
     *
     * @returns {number}
     */
    getMassReleased() {
        return this._massReleased;
    }

    /**
     *
     * @returns {number}
     */
    getMolarMass() {
        return this._molarMass;
    }

    /**
     *
     * @returns {number}
     */
    getSamplingTime() {
        return this._samplingTime;
    }

    /**
     * Could potentially move this to the General Gaussian Plume
     * Not necessarily specific to the Puff
     * @see https://en.wikipedia.org/wiki/Root-mean-square_speed
     * @returns {number} m/s
     */
    getRms() {
        return Math.sqrt(
            (3 * this.getAtmosphere().getTemperature() * GAS_CONSTANT) / this.getMolarMass()
        );
    }

    /**
     * Only for sources with finite dimensions.
     * See reference @formula (4.1)
     * @see http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf pg 12
     * @param {number} t
     * @returns {number}
     */
    getPlumeRiseSpread(t) {
        let x = this.getCenter(t);
        let windSpeed = this.getWindSpeedAtSourceHeight();
        let stdYTerm = Math.pow(this.getStdY(x), 2);
        let sigmaYWTerm = Math.pow(0.065 * x * Math.sqrt(7 * this.getSamplingTime() / windSpeed), 2);
        let srcDiamTerm = Math.pow(this.getSource().getRadius(), 2) / 4;
        return Math.sqrt(stdYTerm - sigmaYWTerm - srcDiamTerm);
    }

    /**
     * The center at x meters downstream after t seconds
     * @param {number} t - seconds after release
     * @returns {number}
     */
    getCenter(t) {
        let windAtSource = this.getWindSpeedAtSourceHeight();
        return integrate(0, t, () => {
            return windAtSource;
        });
    }

    /**
     * @param {number} t
     * @returns {number}
     */
    getStdX(t) {
        let center = this.getCenter(t);
        let stdZ = this.getStdZ(center);
        let duDz = 2;  // change in wind / change in height
        let rmsLngVel = this.getRms(); // sigma_u

        let a = Math.pow(rmsLngVel * t, 2);
        let b = Math.pow(.5 * stdZ * duDz, 2); // longitudinal spread due to shear (Hunt 1982, pg 266)
        let c = 3; // spread due to plume rise squared
        let d = Math.pow(2 * this.getSource().getRadius(), 2) / 4; // (diameter of source)^2 / 4
        
        return Math.sqrt(a + b + c + d);
    }

    /**
     * 
     * Page 17
     * @see http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf
     * 
     * @override
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} t
     */
    getConcentration(x, y, z, t) {
        let stdX = this.getStdX(t);
        let stdY = this.getStdY(x);
        let stdZ = this.getStdZ(x);
        
        let a = this.getMassReleased() / (Math.pow(Math.PI * 2, 1.5) * stdX * stdY * stdZ);
    }
}

export default GaussianPuff;