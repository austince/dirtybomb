/**
 * Created by austin on 6/8/16.
 */
    
import GaussianPlume from './GaussianPlume';
import {integrate} from './utils';


//const GAS_CONSTANT = 8.3144598;

/**
 * Models a discrete release for constant atmospheric
 * http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf pg 17
 * http://www.sciencedirect.com/science/article/pii/S0093641303000247
 */
class GaussianPuff extends GaussianPlume {

    /**
     *
     * @param {Atmosphere} atmosphere
     * @param {Source} source
     * @param {number} massReleased
     */
    constructor(atmosphere, source, massReleased) {
        super(atmosphere, source);
        /**
         * @type {number}
         * @private
         */
        this._massReleased = massReleased;
    }

    /**
     *
     * @returns {number}
     */
    get massReleased() {
        return this._massReleased;
    }


/*    /!**
     * Could potentially move this to the General Gaussian Plume
     * Not necessarily specific to the Puff
     * @see https://en.wikipedia.org/wiki/Root-mean-square_speed
     * @returns {number} m/s
     *!/
    getRms() {
        return Math.sqrt(
            (3 * this.getAtmosphere().getTemperature() * GAS_CONSTANT) / this.getMolarMass()
        );
    }*/

    get maxConcentration() {
        console.error("Not currently supported for Gaussian Puff, only Plume.");
    }
    get maxConcentrationX() {
        console.error("Not currently supported for Gaussian Puff, only Plume.");
    }
    
    /**
     * The center at x meters downstream after t seconds
     * @param {number} t - seconds after release
     * @returns {number} - meters downwind
     */
    getCenterX(t) {
        const windAtSource = this.windSpeedAtSourceHeight;
        return windAtSource * t;
        /*return integrate(0, t, () => {
            return windAtSource;
        });*/
    }

    /**
     * @see http://www.sciencedirect.com/science/article/pii/S0093641303000247 Section 3.2, equation 14
     * @override
     * @param {number} x - downwind (m)
     * @param {number} y - crosswind (m)
     * @param {number} z - height (m)
     * @param {number} t - seconds from start
     * @returns {number}
     */
    getConcentration(x, y, z, t) {
        const deltaD = this.getCenterX(t);
        const stdY = this.getStdY(deltaD);
        const stdZ = this.getStdZ(deltaD);
        const H = this.effectiveSourceHeight;

        const a = this.massReleased / (Math.pow(2 * Math.PI, 1.5) * Math.pow(stdY, 2) * stdZ);
        const b = Math.exp(-0.5 * Math.pow(x / stdY, 2));
        const c = Math.exp(-0.5 * Math.pow(y / stdY, 2));
        const d = Math.exp(-0.5 * Math.pow((z - H) / stdZ, 2));

        const conc = a * b * c * d;
        return isNaN(conc) ? 0 : conc;
    }
}

export default GaussianPuff;