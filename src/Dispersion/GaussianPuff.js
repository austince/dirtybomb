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

    /**
     * The center at x meters downstream after t seconds
     * @param {number} t - seconds after release
     * @returns {number} - meters downwind
     */
    getCenterX(t) {
        let windAtSource = this.windSpeedAtSourceHeight;
        return integrate(0, t, () => {
            return windAtSource;
        });
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
        let deltaD = this.getCenterX(t);
        let stdY = this.getStdY(deltaD);
        let stdZ = this.getStdZ(deltaD);
        let H = this.getEffectiveSourceHeight();

        let a = this.massReleased / (Math.pow(2 * Math.PI, 1.5) * Math.pow(stdY, 2) * stdZ);
        let b = Math.exp(-0.5 * Math.pow(x / stdY, 2));
        let c = Math.exp(-0.5 * Math.pow(y / stdY, 2));
        let d = Math.exp(-0.5 * Math.pow((z - H) / stdZ, 2));

        return a * b * c * d;
    }
}

export default GaussianPuff;