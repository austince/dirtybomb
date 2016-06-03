/**
 * Created by austin on 6/2/16.
 */

/**
 * Currently only supporting Point sources
 * @type {{POINT: number, VOLUME: number, AREA: number}}
 */
const SourceType = {
    POINT: 0,
    VOLUME: 1,
    AREA: 2
};

class Source {
    constructor(emissionRate, height, type) {
        this.emissionRate = emissionRate;
        this.height = height;
        this.type = type;
    }
    
    static get SourceType() {
        return SourceType;
    }
}

// export default SourceType;
export default Source;
