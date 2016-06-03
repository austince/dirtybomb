/**
 * Created by austin on 6/2/16.
 */

import {Source} from './Source';
import {AtmosphericStability} from './AtmosphericStability';

class GaussianPlume {
    constructor(avgGroundWindSpeed, skyCover, solarElevation) {
        this.avgGroundWindSpeed = avgGroundWindSpeed;
        this.source = null;
        this.atmosphere = new AtmosphericStability(avgGroundWindSpeed, skyCover, solarElevation);
        
    }

    addSource(source) {
        this.source = source;
    }

    getStdX() {
        return this.stdX;
    }

    getStdY() {
        return;
    }

    getStdZ() {
        return;
    }
}

export default GaussianPlume;