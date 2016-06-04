/**
 * Created by austin on 6/2/16.
 * file: Dirtybomb.js
 * 
 */
import GaussianPlume, {
    Atmosphere,
    Source,
    SourceType
} from './GaussianPlume/GaussianPlume'

const dirtybomb = {};

dirtybomb.GaussianPlume = GaussianPlume;
dirtybomb.Atmosphere = Atmosphere;
dirtybomb.Source = Source;
dirtybomb.SourceType = SourceType;

export default dirtybomb;