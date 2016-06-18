/**
 * Wraps everything up doi
 * Created by austin on 6/16/16.
 * @file Dispersion.js
 *
 */

import Source, {SourceType} from './Source';
import Atmosphere from './Atmosphere';
import GaussianPlume from './GaussianPlume';
import GaussianDecayPlume from './GaussianDecayPlume';
import GaussianPuff from './GaussianPuff';
import GaussianDecayPuff from './GaussianDecayPuff';
import DynamicGaussianPuff from './DynamicGaussianPuff';
import DynamicGaussianDecayPuff from './DynamicGaussianDecayPuff';
import Vector from './Vector';

/**
 * Wrapper for the Dispersion Library
 */
class Dispersion {}

/**
 * 
 * @type {Source}
 */
Dispersion.Source = Source;
/**
 * 
 * @type {{POINT: number, VOLUME: number, AREA: number}}
 */
Dispersion.SourceType = SourceType;
/**
 * 
 * @type {Atmosphere}
 */
Dispersion.Atmosphere = Atmosphere;
/**
 * 
 * @type {GaussianPlume}
 */
Dispersion.GaussianPlume = GaussianPlume;
/**
 * 
 * @type {GaussianDecayPlume}
 */
Dispersion.GaussianDecayPlume = GaussianDecayPlume;
Dispersion.GasussianPuff = GaussianPuff;
Dispersion.GaussianDecayPuff = GaussianDecayPuff;
Dispersion.DynamicGaussianPuff = DynamicGaussianPuff;
Dispersion.DynamicGaussianDecayPuff = DynamicGaussianDecayPuff;
Dispersion.Vector = Vector;

export default Dispersion;