/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */

import Dispersion from './Dispersion/Dispersion';
import ExplosiveMaterial from './ExplosiveMaterial';
import NuclearMaterial from './NuclearMaterial';

/**
 * A simple dirtybomb
 */
class Dirtybomb {
    
    /**
     * 
     * @param {ExplosiveMaterial} expMat
     * @param {NuclearMaterial} nuclearMat
     * @param {Atmosphere} atmosphere
     */
    constructor(expMat, nuclearMat, atmosphere) {
        this._expMat = expMat;
        this._nucMat = nuclearMat;
        this._atmosphere = atmosphere;
    }

    set atmosphere(atmosphere) {
        this._atmosphere = atmosphere;
    }
}


Dirtybomb.Atmosphere = Dispersion.Atmosphere;

export default Dirtybomb;