/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */
import GaussianPlume, {
    Atmosphere,
    Source,
    SourceType
} from './Dispersion/GaussianPlume';
import GaussianDecayPlume from './Dispersion/GaussianDecayPlume';

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

export default Dirtybomb;