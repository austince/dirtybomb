/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */
import GaussianPlume, {
    Atmosphere,
    Source,
    SourceType
} from './GaussianPlume/GaussianPlume';
import GaussianDecayPlume from './GaussianPlume/GaussianDecayPlume';

const Dirtybomb = {};

Dirtybomb.GaussianPlume = GaussianPlume;
Dirtybomb.GaussianDecayPlume = GaussianDecayPlume;
Dirtybomb.Atmosphere = Atmosphere;
Dirtybomb.Source = Source;
Dirtybomb.SourceType = SourceType;

export default Dirtybomb;