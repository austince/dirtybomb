(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Dirtybomb = global.Dirtybomb || {})));
}(this, function (exports) { 'use strict';

  /**
   * Created by austin on 6/2/16.
   * file: Source.js
   */

  /**
   * Currently only supporting Point sources
   * @type {{POINT: string, VOLUME: string, AREA: string}}
   */
  const SourceType = {
      POINT: 'point',
      VOLUME: 'volume',
      AREA: 'area'
  };

  /**
   * Where the contaminate comes from !
   */
  class Source {
      
      /**
       * 
       * @param {string} type - The type of source 
       * @param {number} emissionRate - Maximum hourly emissions rate in g/s
       * @param {number} height - m
       * @param {number} radius - m
       * @param {number} temperature - Kelvin
       * @param {number} exitVelocity -  m/s
       */
      constructor(type, emissionRate, height, radius, temperature, exitVelocity) {
          /**
           * 
           * @type {number}
           * @private
           */
          this._emissionRate = emissionRate;
          /**
           * 
           * @type {number}
           * @private
           */
          this._height = height;
          /**
           * 
           * @type {number}
           * @private
           */
          this._radius = radius;
          /**
           * 
           * @type {SourceType}
           * @private
           */
          this._type = type;
          /**
           * 
           * @type {number}
           * @private
           */
          this._temp = temperature;
          /**
           * 
           * @type {number}
           * @private
           */
          this._exitVel = exitVelocity;
      }

      /**
       * 
       * @returns {string}
       */
      toString() {
          return `${this.type}: Emission rate of ${this.emissionRate} g/s`;
      }

      /**
       * 
       * @param {number} rate - (g/s)
       * @returns {Source}
       */
      setEmissionRate(rate) {
          this._emissionRate = rate;
          return this;
      }
      /**
       * 
       * @returns {number}
       */
      get emissionRate() {
          return this._emissionRate;
      }

      /**
       * 
       * @param {number} height
       * @returns {Source}
       */
      setHeight(height) {
          this._height = height;
          return this;
      }
      /**
       * 
       * @returns {number}
       */
      get height() {
          return this._height;
      }

      /**
       * 
       * @param {number} radius
       * @returns {Source}
       */
      setRadius(radius) {
          this._radius = radius;
          return this;
      }
      
      /**
       * 
       * @returns {number}
       */
      get radius() {
          return this._radius;
      }

      /**
       * 
       * @returns {SourceType}
       */
      get type() {
          return this._type;
      }

      /**
       * 
       * @param {number} temp
       * @returns {Source}
       */
      setTemperature(temp) {
          this._temp = temp;
          return this;
      }
      
      /**
       * 
       * @returns {number}
       */
      get temperature() {
          return this._temp;
      }

      /**
       * 
       * @param {number} velocity
       * @returns {Source}
       */
      setExitVelocity(velocity) {
          this._exitVel = velocity;
          return this;
      }
      /**
       * 
       * @returns {number}
       */
      get exitVelocity() {
          return this._exitVel;
      }
  }

  Source.SourceType = SourceType;

  /**
   * ES5
   * https://evanw.github.io/lightgl.js/docs/vector.html
   */

  class Vector {
      /**
       *
       * @param x
       * @param y
       * @param z
       */
      constructor(x, y ,z) {
          this.x = x || 0;
          this.y = y || 0;
          this.z = z || 0;
      }

      /**
       *
       * @returns {Vector}
       */
      negative(){
          return new Vector(-this.x, -this.y, -this.z);
      }
      /**
       *
       * @param {Vector || number} v
       * @returns {Vector}
       */
      add(v) {
          if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
          else if (Array.isArray(v)) return Vector.fromArray(v).add(this);
          else return new Vector(this.x + v, this.y + v, this.z + v);
      }
      subtract(v) {
          if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
          else if (Array.isArray(v)) return Vector.fromArray(v).subtract(this);
          else return new Vector(this.x - v, this.y - v, this.z - v);
      }
      multiply(v) {
          if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
          else return new Vector(this.x * v, this.y * v, this.z * v);
      }
      divide(v) {
          if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
          else return new Vector(this.x / v, this.y / v, this.z / v);
      }
      equals(v) {
          return this.x == v.x && this.y == v.y && this.z == v.z;
      }
      dot(v) {
          return this.x * v.x + this.y * v.y + this.z * v.z;
      }
      cross(v) {
          return new Vector(
          this.y * v.z - this.z * v.y,
          this.z * v.x - this.x * v.z,
          this.x * v.y - this.y * v.x
          );
      }
      length() {
          return Math.sqrt(this.dot(this));
      }
      unit() {
          return this.divide(this.length());
      }
      min() {
          return Math.min(Math.min(this.x, this.y), this.z);
      }
      max() {
          return Math.max(Math.max(this.x, this.y), this.z);
      }
      /**
       *
       * @returns {number}
       */
      abs() {
          return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
      }

      toAngles() {
          return {
              theta: Math.atan2(this.z, this.x),
              phi: Math.asin(this.y / this.length())
          }
      }
      angleTo(a) {
          return Math.acos(this.dot(a) / (this.length() * a.length()));
      }
      toArray(n) {
          return [this.x, this.y, this.z].slice(0, n || 3);
      }
      clone() {
          return new Vector(this.x, this.y, this.z);
      }
      init(x, y, z) {
          this.x = x; this.y = y; this.z = z;
          return this;
      }
  }

  Vector.negative = (a, b) => {
      b.x = -a.x; b.y = -a.y; b.z = -a.z;
      return b;
  };
  Vector.add = (a, b, c) => {
      if (b instanceof Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; }
      else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
      return c;
  };
  Vector.subtract = (a, b, c) => {
      if (b instanceof Vector) { c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z; }
      else { c.x = a.x - b; c.y = a.y - b; c.z = a.z - b; }
      return c;
  };
  Vector.multiply = (a, b, c) => {
      if (b instanceof Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; }
      else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
      return c;
  };
  Vector.divide = (a, b, c) => {
      if (b instanceof Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; }
      else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
      return c;
  };
  Vector.cross = (a, b, c) => {
      c.x = a.y * b.z - a.z * b.y;
      c.y = a.z * b.x - a.x * b.z;
      c.z = a.x * b.y - a.y * b.x;
      return c;
  };
  Vector.unit = (a, b) => {
      var length = a.length();
      b.x = a.x / length;
      b.y = a.y / length;
      b.z = a.z / length;
      return b;
  };
  Vector.fromAngles = (theta, phi) => {
      return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
  };
  Vector.randomDirection = () => {
      return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
  };
  Vector.min = (a, b) => {
      return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  };
  Vector.max = (a, b) => {
      return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
  };
  Vector.lerp = (a, b, fraction) => {
      return b.subtract(a).multiply(fraction).add(a);
  };
  Vector.fromArray = (a) => {
      return new Vector(a[0], a[1], a[2]);
  };
  Vector.angleBetween = (a, b) => {
      return a.angleTo(b);
  };

  /**
   * On a scale of 0 - 6
   * Extremely unstable A ... DD, DN ... F Moderately Stable
   * @type {string[]}
   */
  const LETTER_GRADES = ['A', 'B', 'C', 'DD', 'DN', 'E', 'F'];

  /**
   * Overcast should always receive a 3 (D)
   * From Table. 2 on Page 9, all mid grades are rounded up.
   * Maps _windSpeedVec and _skyCover to a grade
   * [<2, 2-3, 3-5, 5-6, >6] then
   * [strong, moderate, slight]
   * @type {number[][]}
   */
  const DAY_GRADES = [
      [0, 0, 1],
      [0, 1, 2],
      [1, 1, 2],
      [2, 2, 3],
      [2, 3, 3]
  ];

  /**
   * Defined as one hour before sunset to one hour after sunrise
   * NOTE: Night Grade D is DN, 4
   * [_skyCover > .5, _skyCover < .5]
   * @type {number[][]}
   */
  const NIGHT_GRADES = [  
      [4, 4], // No given, assumed Class D / not practically possible
      [5, 6],
      [4, 5],
      [4, 4],
      [4, 4]
  ];

  /**
   * Contains constants for wind in rural / urban settings
   * @type {Object[]}
   * @property {number} rural
   * @property {number} urban
   */
  const WIND_PROFILES = [
      {rural: 0.07, urban: 0.15},
      {rural: 0.07, urban: 0.15},
      {rural: 0.1, urban: 0.2},
      {rural: 0.15, urban: 0.3},
      {rural: 0.15, urban: 0.3},
      {rural: 0.35, urban: 0.3},
      {rural: 0.55, urban: 0.3}
  ];

  /**
   * Represents the physical surroundings of a Gaussian Plume
   */
  class Atmosphere {

      /**
       * Only windSpeed, _skyCover, and _solarElevation are required.
       * Temperature is required when not _setting effective source _height manually
       * The default is urban daytime.
       * @param {Array|number} windSpeed - at ground level (m/s)
       * @param {number} skyCover - a percentage 0-1
       * @param {number} solarElevation - (degrees)
       * @param {number} temperature - (Kelvin)
       * @param {number} pressure - (atm)
       * @param {string} [setting="urban"]
       * @param {boolean} [isNight=false] - Can change this to a Date, but should be simple enough to keep track of for the user
       *          1 hour before sunset and 1 hour past sunrise
       */
      constructor(windSpeed, skyCover, solarElevation, temperature, pressure = 1, setting = "urban", isNight = false) {
          /**
           * 
           * @type {Vector}
           * @private
           */
          this._windSpeedVec = Array.isArray(windSpeed) ? Vector.fromArray(windSpeed) : new Vector(windSpeed);
          /**
           * 
           * @type {number}
           * @private
           */
          this._skyCover = skyCover;
          /**
           * 
           * @type {number}
           * @private
           */
          this._solarElevation = solarElevation;
          /**
           * 
           * @type {number}
           */
          this._temp = temperature;
          /**
           * 
           * @type {number}
           * @private
           */
          this._pressure = pressure;
          /**
           * 
           * @type {string}
           * @private
           */
          this._setting = setting;
          /**
           * 
           * @type {boolean}
           * @private
           */
          this._isNight = isNight;
          //this.grade = Atmosphere.calculateGrade(_skyCover, _solarElevation, _windSpeedVec);
      }

      /**
       * 
       * @returns {string}
       */
      toString() {
          return "Grade: " + this.letterGrade +
              " Wind at " + this.windSpeed + " m/s," +
              " Sun at " + this._solarElevation + " degrees";
      }

      /* Static methods: these seemed more convenient at the time so one wouldn't have
      * to build a whole Atmosphere object to calculate a grade, but now seem useless */

      /**
       * Helper function for grade calculation
       * @private
       * @param {number} windSpeed - m/s
       * @returns {number} index of windLevel in WIND_PROFILES
       */
      static _getWindLevel(windSpeed) {
          let level;
          if (windSpeed < 2) {
              // < 2
              level = 0;
          } else if (windSpeed < 3) {
              // 2 - 3
              level = 1;
          } else if (windSpeed < 5) {
              // 3 - 5;
              level = 2;
          } else if (windSpeed < 6) {
              // 5 - 6
              level = 3;
          } else {
              // > 6
              level = 4;
          }
          return level;
      }

      /**
       * Helper function for grade calculation
       * @private
       * @param {number} skyCover 
       * @param {number} solarElevation 
       * @returns {number} 
       */
      static _getInsolationLevel(skyCover, solarElevation) {
          let insolation;
          if (skyCover <= .5) {
              if (solarElevation > 60) {
                  // strong
                  insolation = 0;
              } else if (solarElevation > 35) {
                  // moderate
                  insolation = 1;
              } else {
                  // slight
                  insolation = 2;
              }
          } else {
              if (solarElevation > 60) {
                  // moderate
                  insolation = 1;
              } else if (solarElevation > 35) {
                  // slight
                  insolation = 2;
              } else {
                  // slight
                  insolation = 2;
              }
          }
          return insolation;
      }

      /**
       * Calculates a grade with given parameters
       * @param {number} skyCover 
       * @param {number} solarElevation 
       * @param {number} windSpeed
       * @param {boolean} isNight 
       * @returns {number} 0 - 6
       */
      static calculateGrade(skyCover, solarElevation, windSpeed, isNight) {
          let grade;
          const windLevel = Atmosphere._getWindLevel(windSpeed);
          if (isNight) {
              const coverLevel = skyCover > .5 ? 0 : 1; // For night, just two columns
              grade = NIGHT_GRADES[windLevel][coverLevel];
          } else {
              const insolation = Atmosphere._getInsolationLevel(skyCover, solarElevation);
              grade = DAY_GRADES[windLevel][insolation];
          }
          return grade;
      }
      
      /**
       * 
       * @returns {number} 0-6
       */
      get grade() {
          return Atmosphere.calculateGrade(this.skyCover, this.solarElevation, this.windSpeed, this.isNight);
      }
      
      /**
       * The Human readable
       * @returns {string} A - F
       */
      get letterGrade() {
          return LETTER_GRADES[this.grade];
      }

      /**
       * 
       * @param speed {Vector|number[]|number} m/s
       * @returns {Atmosphere}
       */
      setWindSpeed(speed) {
          if (speed instanceof Vector)
              this._windSpeedVec = speed.clone();
          else
              this._windSpeedVec = Array.isArray(speed) ? Vector.fromArray(speed) : new Vector(speed);
          return this;
      }

      /**
       * 
       * @returns {Vector|*}
       */
      get windSpeedVec() {
          return this._windSpeedVec;
      }
      
      /**
       * 
       * @returns {number} m/s
       */
      get windSpeed() {
          return this.windSpeedVec.abs();
      }

      /**
       * The percentage of the sky is covered
       * @param {number} cover - 0 - 1
       * @returns {Atmosphere}
       */
      setSkyCover(cover) {
          this._skyCover = cover;
          return this;
      }

      /**
       * 
       * @returns {number}
       */
      get skyCover() {
          return this._skyCover;
      }

      /**
       * 
       * @param {number} elevation - degrees 
       * @returns {Atmosphere}
       */
      setSolarElevation(elevation) {
          this._solarElevation = elevation;
          return this;
      }

      /**
       * 
       * @returns {number} degrees
       */
      get solarElevation() {
          return this._solarElevation;
      }

      /**
       * 
       * @param {number} temp - Kelvin
       * @returns {Atmosphere}
       */
      setTemperature(temp) {
          this._temp = temp;
          return this;
      }

      /**
       * 
       * @returns {number|*} Kelvin
       */
      get temperature() {
          return this._temp;
      }

      /**
       * 
       * @param pressure
       * @returns {Atmosphere}
       */
      setPressure(pressure) {
          this._pressure = pressure;
          return this;
      }

      /**
       * 
       * @returns {number}
       */
      get pressure() {
          return this._pressure;
      }

      /**
       * 
       * @param {string} setting - Either "rural" or "urban"
       * @returns {Atmosphere}
       */
      setSetting(setting) {
          this._setting = setting;
          return this;
      }

      /**
       * 
       * @returns {string}
       */
      get setting() {
          return this._setting;
      }

      /**
       * 
       * @param {boolean} isNight
       * @returns {Atmosphere}
       */
      setIsNight(isNight) {
          this._isNight = isNight;
          return this;
      }

      /**
       *
       * @returns {boolean|*}
       */
      get isNight() {
          return this._isNight;
      }
      
      /**
       * Adjusts wind speed to a specific _height. Approximation.
       * @param {number} height - m
       * @returns {number} The approx. wind speed at a specified _height above the ground (m/s)
       */
      getWindSpeedAt(height) {
          // Assumes ground wind speed was measured at 10m
          const windProfile = this._setting === 'urban' ? 
              WIND_PROFILES[this.grade].urban : WIND_PROFILES[this.grade].rural;
          return this.windSpeed * Math.pow((height / 10), windProfile);
      }
  }

  /**
   * @typedef {Object} Stat
   * @property {number} x - meters downwind
   * @property {number} y - meters crosswind
   * @property {number} z - meters vertical
   * @property {number} stdY
   * @property {number} stdZ
   * @property {number} concentration - micrograms / cubic meter
   */

  /**
   * @typedef {Object} Coord
   * @property {number} x - meters downwind 
   * @property {number} y - meters crosswind 
   * @property {number} z - meters vertical 
   */

  /**
   * @typedef {Object} STD_Y_COEFF
   * @property {number} c
   * @property {number} d
   */
  /**
   * 0 - 6 for atm stab grade
   * [x < 10000, x >= 10000]
   *  @type {STD_Y_COEFF}
   */
  const STD_Y_COEFFS = [
      [{c: .495, d: .873}, {c: .606, d: .851}],
      [{c: .310, d: .897}, {c: .523, d: .840}],
      [{c: .197, d: .908}, {c: .285, d: .867}],
      [{c: .122, d: .916}, {c: .193, d: .865}],
      [{c: .122, d: .916}, {c: .193, d: .865}],
      [{c: .0934, d: .912}, {c: .141, d: .868}],
      [{c: .0625, d: .911}, {c: .0800, d: .884}]
  ];

  /**
   * @typedef {Object} STD_Z_COEFF
   * @property {number} a
   * @property {number} b
   */
  /** 
   * [x < 500, 500 <= x < 5000, 5000 <= x]
   * @type {STD_Z_COEFF}
   */
  const STD_Z_COEFFS = [
      [{a: .0383, b: 1.281}, {a: .0002539, b: 2.089}, {a: .0002539, b: 2.089}],
      [{a: .1393, b: .9467}, {a: .04936, b: 1.114}, {a: .04936, b: 1.114}],
      [{a: .1120, b: .9100}, {a: .1014, b: .926}, {a: .1154, b: .9106}],
      [{a: .0856, b: .8650}, {a: .2591, b: .6869}, {a: .7368, b: .5642}],
      [{a: .0818, b: .8155}, {a: .2527, b: .6341}, {a: 1.297, b: .4421}],
      [{a: .1064, b: .7657}, {a: .2452, b: .6358}, {a: .9024, b: .4805}],
      [{a: .05645, b: .8050}, {a: .1930, b: .6072}, {a: 1.505, b: .3662}]
  ];

  const G = 9.8; // gravity (m/s^2)

  /**
   * A Simple Gaussian Plume. For resources, please see the github repo.
   * Calculates spread for one hour with constant conditions.
   * 
   * http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf
   */
  class GaussianPlume {

      /**
       * For now, each Plume contains a constant atmosphere and a single Source
       * @param {Atmosphere} atmosphere
       * @param {Source} source
       */
      constructor(atmosphere, source) {
          this.setAtmosphere(atmosphere);
          this.addSource(source);

          /**
           *
           * @type {number}
           * @private
           */
          this._manualEffSrcHeight;
      }

      /**
       * @override
       * @returns {string}
       */
      toString() {
          return '${this.source.toString()} in ${this._atm.toString()}';
      }

      /**
       * Adds a single source to the plume
       * @param {Source} source
       * @returns {GaussianPlume} For chaining purposes
       */
      addSource(source) {
          this._source = source;
          return this;
      }

      /**
       * 
       * @returns {Source}
       */
      get source() {
          return this._source;
      }

      /**
       * @param {Atmosphere} atmosphere
       * @returns {GaussianPlume} For chaining purposes
       */
      setAtmosphere(atmosphere) {
          this._atm = atmosphere;
          return this;
      }

      /**
       * @returns {Atmosphere}
       */
      get atmosphere() {
          return this._atm;
      }

      /**
       * A helper function for the StdZ calculation
       * @protected
       * @param {number} x - distance downwind (m)
       * @returns {STD_Y_COEFF}
       */
      _getStdYCoeffs(x) {
          let index;
          const coeffs = STD_Y_COEFFS[this._atm.grade];
          if (x < 10000) {
              index = 0;
          } else {
              index = 1;
          }
          return coeffs[index];
      }

      /**
       * Brookhaven sigma
       * The crosswind distance standard deviation for a distance x downwind.
       * To be used in a Gaussian distribution
       * @param {number} x - distance downwind (m)
       * @returns {number} crosswind standard deviation at x meters downwind (m)
       */
      getStdY(x) {
          const coeffs = this._getStdYCoeffs(x);
          return coeffs.c * Math.pow(x, coeffs.d);
      }

      /**
       * A helper function for the StdZ calculation
       * @protected
       * @param {number} x - distance downwind (m)
       * @returns {STD_Z_COEFF}
       */
      _getStdZCoeffs(x) {
          let index;
          const coeffs = STD_Z_COEFFS[this._atm.grade];
          if (x < 500) {
              index = 0;
          } else if (x < 5000) {
              index = 1;
          } else {
              // 5000 < x
              index = 2;
          }
          return coeffs[index];
      }

      /**
       * Brookhaven sigma
       * The vertical distance standard deviation for a distance x downwind.
       * To be used in a Gaussian distribution
       * @param {number} x - distance downwind (m)
       * @returns {number}
       */
      getStdZ(x) {
          const coeffs = this._getStdZCoeffs(x);
          return coeffs.a * Math.pow(x, coeffs.b);
      }

      /**
       * 
       * @returns {number} m/s
       */
      get windSpeedAtSourceHeight() {
          return this._atm.getWindSpeedAt(this.effectiveSourceHeight);
      }

      /**
       * Manually set the Effective Source Height
       * @param {number} height 
       * @returns {GaussianPlume} For chaining purposes
       */
      setEffectiveSourceHeight(height) {
          this._manualEffSrcHeight = height;
          return this;
      }
      /**
       *  Takes into account the wind and other factors into account.
       *  Should potentially move this to the Source class
       *  @returns {number} the effective source _height
       *  */
      get effectiveSourceHeight() {
          // If there has been a manually set source height
          // Causes problems if the plume is dynamic
          if (this._manualEffSrcHeight) {
              return this._effSrcHeight;
          }
          const deltaH = this.getMaxRise(0);
          this._effSrcHeight = this.source.height + deltaH;
          return this._effSrcHeight;
      }

      /**
       * 
       * @param x
       * @returns {number}
       */
      getMeanHeight(x) {
          // Should use integrals but need to research how to load a nicer math library in hur

          // For large x this should be ok, between 0 (ground) and maxPlumeRise
          return this.getMaxRise(x) / 2;
      }

      /**
       * The max rise of the plume at x meters downwind
       * @param {number} x - distance (m) downwind
       * @returns {number} vertical standard deviation at x meters downwind (m)
       */
      getMaxRise(x) {
          // @see page 31
          // Grades 1 - 5 are assumed unstable/neutral, 6 - 7 are assumed stable
          // Both the momentum dominated and buoyancy dominated methods should be calculated, then use the max
          let bDeltaH, mDeltaH; // Max plume rise buoyancy, momentum dominated resp.
          const srcRad = this.source.radius;
          const srcTemp = this.source.temperature;
          const srcHeight = this.source.height;
          const srcExitVel = this.source.exitVelocity;
          const ambTemp = this._atm.temperature;
          const F = G * srcExitVel * Math.pow(srcRad, 2) * (srcTemp - ambTemp) / srcTemp;
          const U = this._atm.getWindSpeedAt(srcHeight); // wind speed at stack _height

          if (this._atm.grade <= 5) {
              // unstable/neutral
              // Gets super funky, ugh science

              // Distance to Maximum Plume Rise
              const xStar = F < 55 ? 14 * Math.pow(F, 0.625) : 34 * Math.pow(F, .4);
              // Will use 0 if calculating from the source. Need to read more about this.
              if (x == 0 || x > 3.5 * xStar) {
                  x = xStar;
              }
              bDeltaH = 1.6 * Math.pow(F, .333) * Math.pow(3.5 * x, .667) * Math.pow(U, -1);
              mDeltaH = (3 * srcExitVel * (2 * srcRad)) / U;
          } else {
              // stable
              const s = this._atm.letterGrade === 'E' ? 0.018: 0.025; //  g/ambientTemp
              bDeltaH = 2.6 * Math.pow(F / (U * s), .333);
              mDeltaH = 1.5 * Math.pow(srcExitVel * srcRad, .667) * Math.pow(U, -0.333) * Math.pow(s, -0.166);
          }

          // console.log("bDeltaH: " + bDeltaH);
          // console.log("mDeltaH: " + mDeltaH);
          // Return the max
          if (bDeltaH > mDeltaH) {
              // console.log("Buoyancy dominated.");
              return bDeltaH;
          }
          // console.log("Momentum dominated.");
          return mDeltaH;
      }

      /**
       * Calculates the maximum concentration dispersed
       * @returns {number} micrograms / cubic meters
       */
      get maxConcentration() {
          const x = this.maxConcentrationX;
          const stdY = this.getStdY(x);
          const stdZ = this.getStdZ(x);
          const H = this.effectiveSourceHeight;

          const a = (this.source.emissionRate) / (Math.PI * stdY * stdZ * this.windSpeedAtSourceHeight);
          const b = Math.exp((-0.5) * Math.pow(H / stdZ, 2));

          return a * b;
      }

      /**
       * Calculates the distance downwind of the maximum concentration
       * @returns {number} micrograms / cubic meter
       */
      get maxConcentrationX() {
          // If unknown, set x to 5000 meters
          const stdYCoeffs = this._getStdYCoeffs(5000);  // c , d
          const stdZCoeffs = this._getStdZCoeffs(5000);  // a , b
          const H = this.effectiveSourceHeight;

          const pt1 = (stdZCoeffs.b * Math.pow(H, 2)) / (Math.pow(stdZCoeffs.a, 2) * (stdYCoeffs.d + stdZCoeffs.b));
          return Math.pow(pt1, (1 / (2 * stdZCoeffs.b)));
      }

      /**
       * Calculates the concentration at a given x,y,z coordinate.
       * Must be downwind
       * @param {number} x - Meters downwind of source, greater than 0
       * @param {number} y - Meters crosswind of source
       * @param {number} [z=0] - Meters vertical of ground
       * @returns {number} micrograms / cubic meter
       *
       * @example
       * getConcentration(200, 300, 10)
       * Calculates at 200 meters downwind, 300 east, 10 high
       */
      getConcentration(x, y, z = 0) {
          // First part of Gaussian equation 1 found on page 2
          const stdY = this.getStdY(x);
          const stdZ = this.getStdZ(x);
          // Effective stack _height
          const H = this.effectiveSourceHeight;
          const U = this.windSpeedAtSourceHeight;

          const a = this.source.emissionRate / (2 * Math.PI * stdY * stdZ * U);
          const b = Math.exp(-1 * Math.pow(y, 2) / (2 * Math.pow(stdY, 2)));
          const c = Math.exp(-1 * Math.pow(z - H, 2) / (2 * Math.pow(stdZ, 2)));
          const d = Math.exp(-1 * Math.pow(z + H, 2) / (2 * Math.pow(stdZ, 2)));
          
          // Put it all together! get
          const conc = a * b * (c + d);
          // return 0 if it's not a number
          return isNaN(conc) ? 0 : conc;
      }

      /**
       * Calculates the stdY, stdZ, and concentrations for a list of x coordinates
       *  directly downwind of the source
       * Useful in creating graphs / processing large amounts of data at once
       * @param {number[]} xs - a list of x's
       * @returns {Stat[]} a list of stats
       */
      getStatsForXs(xs) {
          let stats = [];
          for (let i = 0; i < xs.length; i++) {
              stats.push({
                  x: xs[i],
                  y: 0,
                  z: 0,
                  stdY: this.getStdY(xs[i]),
                  stdZ: this.getStdZ(xs[i]),
                  concentration: this.getConcentration(xs[i], 0, 0)
              })
          }
          return stats;
      }

      /**
       * Same as getStatsForXs, but for 3d coordinates
       * @param {Coord[]} coords - a list of objects with x,y,z params
       * @returns {Stat[]}
       */
      getStatsForCoords(coords) {
          let stats = [];
          for (let i = 0; i < coords.length; i++) {
              stats.push({
                  x: coords[i].x,
                  y: coords[i].y,
                  z: coords[i].z,
                  stdY: this.getStdY(xs[i]),
                  stdZ: this.getStdZ(xs[i]),
                  concentration: this.getConcentration(coords[i].x, coords[i].y, coords[i].z)
              })
          }
          return stats;
      }
  }

  //const GAS_CONSTANT = 8.3144598;

  /**
   * Models a discrete release for constant atmospheric
   * pg 17
   * http://www.cerc.co.uk/environmental-software/assets/data/doc_techspec/CERC_ADMS5_P10_01_P12_01.pdf
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

  /**
   * Adds decay to the Simple Gaussian Puff
   */
  class GaussianDecayPuff extends GaussianPuff {
      /**
       *
       * @param {Atmosphere} atmosphere
       * @param {Source} source
       * @param {number} massReleased
       * @param {number} halfLife - seconds
       */
      constructor(atmosphere, source, massReleased, halfLife) {
          super(atmosphere, source, massReleased);

          /**
           *
           * @type {number}
           * @private
           */
          this._halfLife = halfLife; // Usually the half-life of the pollutant

          /**
           * 
           * @type {number}
           * @private
           */
          this._decayCoeff = 0.693 / halfLife;
      }

      /**
       *
       * @returns {number}
       */
      get halfLife() {
          return this._halfLife;
      }

      /**
       * Read URAaTM pg 281 - 285
       * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
       * @param {number} x - downwind distance (m)
       * @param {number} windSpeed - at source _height (m/s)
       * @returns {number} Decay term
       */
      getDecayTerm(x, windSpeed) {
          if (this._decayCoeff == 0) {
              return 1;
          } else {
              return Math.exp(- this._decayCoeff * (x / windSpeed));
          }
      }

      /**
       * Takes into account the decay term, as seen in URAaTM pg 281
       * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
       * @override
       * @param {number} x - downwind (m)
       * @param {number} y - crosswind (m)
       * @param {number} z - _height (m)
       * @param {number} t - seconds from start
       */
      getConcentration(x, y, z, t) {
          let unDecayed = super.getConcentration(x, y, z, t);
          let decayTerm = this.getDecayTerm(x, this.atmosphere.windSpeed);
          return unDecayed * decayTerm;
      }
  }

  /**
   * Allows for atmospheric changes between puff movements
   */
  class DynamicGaussianPuff extends GaussianPuff {
      /**
       *
       * @param {Atmosphere} atmosphere
       * @param {Source} source
       * @param {number} massReleased
       * @param {array} [center] - Manually set the center, defaults to (0,0,0)
       */
      constructor(atmosphere, source, massReleased, center) {
          super(atmosphere, source, massReleased);

          /**
           * 
           * @type {number}
           * @private
           */
          this._currentTime = 0;

          /**
           * Really doesn't need to be a vector. Easy enough to use a vector as a cartesian coord though.
           * @type {Vector}
           * @private
           */
          this._currentCenter = center ? Vector.fromArray(center) : new Vector(0, 0, this.effectiveSourceHeight);

          /**
           * @type {Vector}
           * @private
           */
          this._startCenter = this._currentCenter.clone();

          /**
           *
           * @type {Array}
           * @private
           */
          this._path = [];

          /**
           * dY
           * @type {number}
           * @private
           */
          this._virtHoriz = 0;

          /**
           * dZ
           * @type {number}
           * @private
           */
          this._vertDist = 0;

          /**
           * 
           * @type {number}
           * @private
           */
          this._stdY = 0;

          /**
           * 
           * @type {number}
           * @private
           */
          this._stdZ = 0;
      }

      /**
       * 
       * @returns {number}
       */
      get time() {
          return this._currentTime;
      }

      /**
       *
       * @param center
       * @returns {DynamicGaussianPuff}
       * @private
       */
      _setCenter(center) {
          this._currentCenter = center;
          return this;
      }

      /**
       *
       * @returns {Vector}
       */
      get center() {
         return this._currentCenter;
      }
      
      get path() {
          return this._path;
      }

      /**
       *
       * @returns {Vector}
       */
      get start() {
          return this._startCenter;
      }

      /**
       * 
       * @returns {number}
       */
      get distanceFromStart() {
          return this.center.subtract(this.start).abs();
      }

      /**
       * 
       * @returns {number}
       */
      get distanceTraveled() {
          let dist = 0;
          let start = this.start;
          for (var point of this._path) {
              dist += point.subtract(start).abs();
              start = point;
          }
          return dist;
      }

      /**
       * A helper function for the StdZ calculation
       * @override
       * @protected
       * @returns {STD_Y_COEFF}
       */
      _getStdYCoeffs() {
          let x = this.distanceTraveled;
          return super._getStdYCoeffs(x);
      }
      
      /**
       * Brookhaven sigma
       * The crosswind distance standard deviation for a distance x downwind.
       * To be used in a Gaussian distribution
       * @override
       * @returns {number} crosswind standard deviation at x meters downwind (m)
       */
      get stdY() {
          return this._stdY;
      }

      /**
       * Brookhaven sigma
       * The vertical distance standard deviation for a distance x downwind.
       * To be used in a Gaussian distribution
       * @override
       * @returns {number}
       */
      get stdZ() {
          return this._stdZ;
      }

      /**
       * 
       * @returns {number|*}
       */
      get virtHoriz() {
          return this._virtHoriz;
      }

      /**
       * 
       * @returns {number|*}
       */
      get vertDist() {
          return this._vertDist;
      }

      /**
       * Moves the puff along by t seconds
       * @see http://www.sciencedirect.com/science/article/pii/S0093641303000247 Section 3.2, equation 14
       * @param {number} deltaT - seconds to increment by
       * @returns {DynamicGaussianPuff}
       */
      step(deltaT) {
          // update vertHoriz and vertDist
          const x = this.distanceTraveled;
          const stdYCoeffs = super._getStdYCoeffs(x);
          const stdZCoeffs = super._getStdZCoeffs(x);

          // Update the Virtual horizontal and the vertical distance @see equation 15
          this._virtHoriz = Math.pow((this.stdY / stdYCoeffs.c), (1 / stdYCoeffs.d));
          this._vertDist = Math.pow((this.stdZ / stdZCoeffs.a), (1 / stdZCoeffs.b));

          // Find the change in x and y directions
          // Todo: use Navier-Stokes equation solver to account for momentum @see equation 16
          const deltaDVec = this.atmosphere.windSpeedVec.multiply(deltaT);    // The change in distance from wind
          const deltaD = deltaDVec.abs();

          // Update the standard deviations @see equation 17
          this._stdY = stdYCoeffs.c * Math.pow(this.virtHoriz + deltaD, stdYCoeffs.d);
          this._stdZ = stdZCoeffs.a * Math.pow(this.vertDist + deltaD, stdZCoeffs.b);

          // Update position/time/path
          this._currentTime += deltaT;
          this._setCenter(this.center.add(deltaDVec));
          this._path.push(this.center.clone());
          
          return this;
      }

      /**
       * @see http://www.sciencedirect.com/science/article/pii/S0093641303000247 Section 3.2, equation 14
       * @override
       * @param {number} x - downwind (m)
       * @param {number} y - crosswind (m)
       * @param {number} z - _height (m)
       * @returns {number}
       */
      getConcentration(x, y, z) {
          if (this.time == 0) return 0;

          const stdY = this.stdY;
          const stdZ = this.stdZ;
          const H = this.effectiveSourceHeight;

          const a = this.massReleased / (Math.pow(2 * Math.PI, 1.5) * Math.pow(stdY, 2) * stdZ);
          const b = Math.exp(-0.5 * Math.pow(x / stdY, 2));
          const c = Math.exp(-0.5 * Math.pow(y / stdY, 2));
          const d = Math.exp(-0.5 * Math.pow((z - H) / stdZ, 2));

          const conc = a * b * c * d;
          return isNaN(conc) ? 0 : conc;
      }

  }

  /**
   * Adds half life decay to the Dynamic Puff
   */
  class DynamicGaussianDecayPuff extends DynamicGaussianPuff {

      /**
       *
       * @param {Atmosphere} atmosphere
       * @param {Source} source
       * @param {number} massReleased
       * @param {number} halfLife - seconds
       * @param {array} [center] - Manually set the center, defaults to (0,0,0)
       */
      constructor(atmosphere, source, massReleased, halfLife, center) {
          super(atmosphere, source, massReleased, center);

          /**
           *
           * @type {number}
           * @private
           */
          this._halfLife = halfLife; // Usually the half-life of the pollutant

          /**
           *
           * @type {number}
           * @private
           */
          this._decayCoeff = 0.693 / halfLife;
      }

      /**
       *
       * @returns {number}
       */
      get halfLife() {
          return this._halfLife;
      }

      /**
       * Read URAaTM pg 281 - 285
       * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
       * @param {number} x - downwind distance (m)
       * @param {number} windSpeed - at source _height (m/s)
       * @returns {number} Decay term
       */
      getDecayTerm(x, windSpeed) {
          if (this._decayCoeff == 0) {
              return 1;
          } else {
              return Math.exp(- this._decayCoeff * (x / windSpeed));
          }
      }
      
      /**
       * Takes into account the decay term, as seen in URAaTM pg 281
       * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
       * @override
       * @param {number} x - downwind (m)
       * @param {number} y - crosswind (m)
       * @param {number} z - _height (m)
       */
      getConcentration(x, y, z) {
          let unDecayed = super.getConcentration(x, y, z);
          let decayTerm = this.getDecayTerm(x, this.atmosphere.windSpeed);
          return unDecayed * decayTerm;
      }
  }

  // For some reason importing Atmosphere makes Rollup unhappy

  /**
   * Explosive energy of tnt
   * MJ/kg
   * @type {number}
   * @see https://en.wikipedia.org/wiki/TNT_equivalent
   */
  const Q_TNT = 4.184;    // One Megaton of TNT == 4.184 Petajoules

  /**
   * A simple bomb 
   */
  class Bomb {
      /**
       *
       * @param {number} tntEqvMass - Standardized TNT equivalent kg (kg)
       * @param {Atmosphere} [atmosphere=Bomb.STANDARD_ATM]
       * @param {boolean} [isStatic=true] - Determines the type of puff that is used
       */
      constructor(tntEqvMass, atmosphere = Bomb.STANDARD_ATM, isStatic = true) {
          /**
           *
           * @type {number}
           * @private
           */
          this._mass = tntEqvMass;
          /**
           * A standardized measure for weapon strength
           * @type {number}
           * @private
           */
          this._weaponYield = tntEqvMass / 1000000;
          /**
           *
           * @type {Atmosphere}
           * @private
           */
          this._atm = atmosphere;

          /**
           * 
           * @type {Source}
           * @private
           */
          this._source = new Source(
              SourceType.POINT,
              Math.POSITIVE_INFINITY, // Emission rate, arb for puffs. TODO!
              this.cloudHeight,
              this.cloudRadius,
              this.getGasTemp(this.cloudHeight),
              this.getGasVelocity(this.cloudHeight)
          );
          
          if (isStatic) {
              this._puff = new GaussianPuff(
                  atmosphere,
                  this._source,
                  this.mass // Todo: how to calculate how much mass goes into the air?
              );
          } else {
              this._puff = new DynamicGaussianDecayPuff(
                  atmosphere,
                  this._source,
                  this.mass // Todo: how to calculate how much mass goes into the air?
              );
          }
          
          
          if (this.weaponYield > 1000) {
              console.warn("WARNING: this bomb library is meant for bombs weaponYields under 1000.");
          }
      }

      /**
       *
       * @param atm
       * @returns {Bomb}
       */
      setAtmosphere(atm) {
          this._atm = atm;
          return this;
      }

      /**
       *
       * @returns {Atmosphere}
       */
      get atmosphere() {
          return this._atm;
      }

      /**
       *
       * @returns {number}
       */
      get weaponYield() {
          return this._weaponYield;
      }

      /**
       *
       * @returns {Source}
       */
      get source() {
          return this._source;
      }

      /**
       *
       * @param mass
       * @returns {Bomb}
       */
      setMass(mass) {
          this._mass = mass;
          return this;
      }

      /**
       *
       * @returns {number}
       */
      get mass() {
          return this._mass;
      }

      /**
       * Based on kilotons of tnt nuclear explosions
       * @returns {number} - (m)
       */
      get blastRadius() {
          return 30 * Math.pow(this.weaponYield, 1/3);
      }

      /**
       * From eq 7 of CISAC Fallout Model
       * Approximating this as the top of the stem cloud
       * Perhaps will change this as a combination of all three cloud alt equations
       * @see http://cisac.fsi.stanford.edu/sites/default/files/geist_2014_cv.pdf
       * @returns {number}
       */
      get cloudHeight() {
          if (this.weaponYield < 2) {
              return 1740 * Math.pow(this.weaponYield, 0.229);
          }
          if (this.weaponYield < 20) {
              return 1720 * Math.pow(this.weaponYield, 0.261);
          }
          return 2040 * Math.pow(this.weaponYield, 0.204);
      }

      /**
       * Should not be used in this context. Really for nuclear bombs.
       * @returns {number}
       * @private
       */
      _getMainCloudRadius() {
          return 872 * Math.pow(this.weaponYield, 0.427);
      }

      /**
       *
       * @returns {number} - (m)
       */
      get cloudRadius() {
          const mainRad = this._getMainCloudRadius();
          if (this.weaponYield < 20) {
              return 0.5 * mainRad;
          }
          if (this.weaponYield <= 1000) {
              return 0.5 * mainRad - 0.3 * mainRad * ((this.weaponYield - 20) / 980);
          }
          return 0.2 * mainRad - 0.1 * mainRad * ((this.weaponYield - 1000) / 9000);
      }

      /**
       *
       * @returns {DynamicGaussianPuff|GaussianPuff} - Depending on if the dispersion is static
       */
      get dispersion() {
          return this._puff;
      }

      /**
       * equation 3
       * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/
       * @param {number} r - distance from origin (m)
       * @returns {number} - pressure (atm)
       */
      getOverpressureAt(r) {
          let a = (0.84 / r) * Math.pow(this._mass, (1/3));
          let b = (2.7 / Math.pow(r, 2)) * Math.pow(this.mass, (2/3));
          let c = (7 / Math.pow(r, 3)) * this.mass;
          return a + b + c;
      }

      /**
       * Velocity of gas in behind shock wave front
       * equation 5.2
       * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/
       * @param {number} r - distance from origin (m)
       * @returns {number} velocity (m/s)
       */
      getGasVelocity(r) {
          const pressure = this.getOverpressureAt(r);
          // Simplified for standard atmosphere
          return 243 * pressure / Math.sqrt(1 + 0.86 * pressure);
      }

      /**
       * Temperature of gas in shock wave front
       * equation 5.3
       * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/
       * @param {number} r - distance from origin (m)
       * @returns {number} temperature (K)
       */
      getGasTemp(r) {
          const pressure = this.getOverpressureAt(r);
          return this.atmosphere.temperature * (1 + pressure) * (7 + pressure) / (7 + 6 * pressure);
      }

      /**
       * Positive Shock Phase Duration
       * equation 4
       * @see https://www.metabunk.org/attachments/blast-effect-calculation-1-pdf.2578/
       * @param {number} r - distance from origin (m)
       * @returns {number} duration (s)
       */
      getPosShockPhaseDuration(r) {
          return 1.3 * Math.pow(this.mass, (1 / 6)) * Math.sqrt(r) * 0.001;
      }

      /**
       * 
       * @param {number} qExp - explosive energy (MJ/kg)
       * @returns {number}
       */
      static tntEquivalentFactor(qExp) {
          return qExp / Q_TNT;
      }

      /**
       * 
       * @param {number} qExp - explosive energy (MJ/kg)
       * @param {number} mass - (kg)
       * @returns {number}
       */
      static tntEquivalent(qExp, mass) {
          return Bomb.tntEquivalentFactor(qExp) * mass;
      }
  }

  /**
   * Should probably move this to the Atmosphere class
   * 0 wind
   * 0 sky cover
   * 65 degrees sun
   * 59 degrees F / 15 degrees C
   * @type {Atmosphere}
   */
  Bomb.STANDARD_ATM = new Atmosphere(0, 0, 65, 288.2);

  /**
   * Created by austin on 6/16/16.
   */

  /**
   * Predefined isotopes:
       Cobalt 60
       Strontium 90 
       Iodine 129 
       Caesium 135 
       Caesium 137 
       Polonium 210 
       Radon 222 
       Radium 226 
       Torium 232 
       Uranium 233 
       Uranium 235 
       Uranium 238 
       Plutonium 238
       Plutonium 239
       Plutonium 240
       Americium 241
       Curium 242
   * 
   * 
   * @type {*[]}
   */
  const ISOTOPES = [
      {name: "Cobalt", element: "Co", mass: 60, halfLife: 166349000, decayMode: "beta,gamma,gamma"},
      {name: "Strontium", element: "Sr", mass: 90, halfLife: 908839000, decayMode: "betaminus"},
      {name: "Iodine", element: "I", mass: 129, halfLife: 495444000000000, decayMode: "beta,gamma"},
      {name: "Caesium", element: "Cs", mass: 135, halfLife: 7.25328e+13, decayMode: "beta"},
      {name: "Caesium", element: "Cs", mass: 137, halfLife: 952072000, decayMode: "beta,gamma"},
      {name: "Polonium", element: "Po", mass: 210, halfLife: 11955700, decayMode: "alpha"},
      {name: "Radon", element: "Rn", mass: 222, halfLife: 330350, decayMode: "alpha"},
      {name: "Radium", element: "Ra", mass: 226, halfLife: 50491100000, decayMode: "alpha"},
      {name: "Thorium", element: "Th", mass: 232, halfLife: 443375000000000000, decayMode: "alpha"},
      {name: "Uranium", element: "U", mass: 233, halfLife: 5023860000000, decayMode: "alpha"},
      {name: "Uranium", element: "U", mass: 235, halfLife: 22209800000000000, decayMode: "alpha"},
      {name: "Uranium", element: "U", mass: 238, halfLife: 140996000000000000, decayMode: "alpha"},
      {name: "Plutonium", element: "Pu", mass: 238, halfLife: 2767540000, decayMode: "alpha"},
      {name: "Plutonium", element: "Pu", mass: 239, halfLife: 760837000000, decayMode: "alpha"},
      {name: "Plutonium", element: "Pu", mass: 240, halfLife: 207108000000, decayMode: "alpha"},
      {name: "Americium", element: "Am", mass: 241, halfLife: 13638900000, decayMode: "alpha"},
      {name: "Curium", element: "Cm", mass: 242, halfLife: 13824000, decayMode: "alpha"}
  ];


  /**
   * Provides a few presets of common nuclear material as well as the ability to define a custom material
    */
  class NuclearMaterial {

      /**
       *
       * @param {number|string} halfLifeOrName - either
       * @param {number} [atomicMass] - necessary with name if using preset (u)
       * @param {number} mass - Total mass of substance (g)
       * @param {string} [decayMode='']
       *
       * @example
       * // 100 grams of Cobalt-60
       * let cobalt60 = new NuclearMaterial("Cobalt", 60, 100);
       *
       * // 100 grams of Plutonium-238
       * let pu238 = new NuclearMaterial(2767540000, 238, 100);
       */
      constructor(halfLifeOrName, atomicMass, mass, decayMode = '') {
          if (typeof halfLifeOrName === 'number') {
              /**
               *
               * @type {number}
               * @private
               */
              this._halfLife = halfLifeOrName;

              /**
               * @type {number|*}
               * @private
               */
              this._atomicMass = atomicMass;

              /**
               * 
               * @type {string}
               * @private
               */
              this._decayMode = decayMode;

          } else {
              let isotopePreset;
              for (let i of ISOTOPES) {
                  if (i.name === halfLifeOrName && i.mass == Math.round(atomicMass)) {
                      isotopePreset = i;
                      break;
                  }
              }

              if (!isotopePreset) 
                  throw new Error('There is no preset for ' + halfLifeOrName + '-'+ atomicMass);

              this._halfLife = isotopePreset.halfLife; // Map to known substances
              this._atomicMass = isotopePreset.mass;
              this._decayMode = isotopePreset.decayMode;
          }


          /**
           * 
           * @type {number}
           * @private
           */
          this._mass = mass;
      }

      /**
       * 
       * @returns {number}
       */
      get mass() {
          return this._mass;
      }

      /**
       * 
       * @returns {number|*}
       */
      get atomicMass() {
          return this._atomicMass;
      }

      /**
       * 
       * @returns {number|*}
       */
      get halfLife() {
          return this._halfLife;
      }

      /**
       * 
       * @returns {string|*}
       */
      get decayMode() {
          return this._decayMode;
      }
  }

  NuclearMaterial.PRESETS = ISOTOPES;

  /**
   * An extension (surprise surprise) on the Gaussian Plume to account for radioactive materials
   */
  class GaussianDecayPlume extends GaussianPlume {

      /**
       * @override
       * @param {Atmosphere} atmosphere
       * @param {Source} source
       * @param {number} halfLife - seconds
       */
      constructor(atmosphere, source, halfLife) {
          super(atmosphere, source);
          /**
           * 
           * @type {number}
           * @private
           */
          this._halfLife = halfLife; // Usually the half-life of the pollutant
          /**
           * 
           * @type {number}
           * @private
           */
          this._decayCoeff = 0.693 / halfLife;
      }

      /**
       * 
       * @returns {number}
       */
      getHalfLife() {
          return this._halfLife;
      }
      
      /**
       * Read URAaTM pg 281 - 285
       * @see https://books.google.com/books?id=bCjRtBX0MYkC&pg=PA280&lpg=PA280&dq=gaussian+decay+plume&source=bl&ots=oJbqk8OmIe&sig=GqzwcwVfbk_XUR6RztjSeVI0J20&hl=en&sa=X&ved=0ahUKEwih4OS7zpTNAhWq5oMKHeM_DyIQ6AEINjAF#v=onepage&q=gaussian%20decay%20plume&f=false
       * @param {number} x - downwind distance (m)
       * @param {number} windSpeed - at source _height (m/s)
       * @returns {number} Decay term
       */
      getDecayTerm(x, windSpeed) {
          if (this._decayCoeff == 0) {
              return 1;
          } else {
              return Math.exp(- this._decayCoeff * (x / windSpeed));
          }
      }

      /**
       * Takes into account the decay term, as seen in URAaTM pg 281
       * Overridden from super class
       * @override
       * @param {number} x
       * @param {number} y
       * @param {number} z
       */
      getConcentration(x, y, z) {
          let unDecayed = super.getConcentration(x, y, z);
          let decayTerm = this.getDecayTerm(x, this.atmosphere.windSpeed);
          return unDecayed * decayTerm;
      }
  }

  /**
   * Wrapper for the Dispersion Library
   */
  const Dispersion = {};
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
  /**
   * 
   * @type {GaussianPuff}
   */
  Dispersion.GaussianPuff = GaussianPuff;
  /**
   * 
   * @type {GaussianDecayPuff}
   */
  Dispersion.GaussianDecayPuff = GaussianDecayPuff;
  /**
   * 
   * @type {DynamicGaussianPuff}
   */
  Dispersion.DynamicGaussianPuff = DynamicGaussianPuff;
  /**
   * 
   * @type {DynamicGaussianDecayPuff}
   */
  Dispersion.DynamicGaussianDecayPuff = DynamicGaussianDecayPuff;
  /**
   * 
   * @type {Vector}
   */
  Dispersion.Vector = Vector;

  /**
   * A simple dirtybomb. Assumes all nuclear material is released into the atmosphere
   */
  class Dirtybomb extends Bomb {

      /**
       * @param {NuclearMaterial} nuclearMat
       * @param {number} tntEqvMass - Standardized TNT equivalent (kg)
       * @param {Atmosphere} [atmosphere=Bomb.STANDARD_ATM]
       * @param {boolean} [isStatic=true] - Determines the type of puff that is used
       * 
       */
      constructor(nuclearMat, tntEqvMass, atmosphere = Bomb.STANDARD_ATM, isStatic = true) {
          super(tntEqvMass, atmosphere, isStatic);
          
          /**
           * @type {NuclearMaterial}
           * @private
           */
          this._nucMat = nuclearMat;

          /**
           * Either
           * @type {GaussianPuff}
           * @private
           */
          this._puff;
          
          if (isStatic) {
              this._puff = new GaussianDecayPuff(
                  atmosphere,
                  this.source,
                  nuclearMat.mass,
                  nuclearMat.halfLife
              );
          } else {
              this._puff = new DynamicGaussianDecayPuff(
                  atmosphere,
                  this.source,
                  nuclearMat.mass,
                  nuclearMat.halfLife
              )
          }
      }
  }

  exports.Dirtybomb = Dirtybomb;
  exports.NuclearMaterial = NuclearMaterial;
  exports.Dispersion = Dispersion;

  Object.defineProperty(exports, '__esModule', { value: true });

}));