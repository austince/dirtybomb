/**
 * Created by austin on 6/22/16.
 */
import chai from 'chai';

const db = require('../dist/Dirtybomb');

chai.should();

describe("DynamicGaussianPuff", function() {
    let puff;

    describe("Constructors", () => {
        let atm = new db.Dispersion.Atmosphere([1, 1], .5, 65, 288);
        let source = new db.Dispersion.Source(
            db.Dispersion.SourceType.POINT,
            Number.POSITIVE_INFINITY,
            20,
            5,
            350,
            5
        );

        it('should use the default center', () => {
            puff = new db.Dispersion.DynamicGaussianPuff(atm, source, 50);
            puff.center.x.should.be.equal(0);
            puff.center.y.should.be.equal(0);
        });

        it('should take explicit center', () => {
            puff = new db.Dispersion.DynamicGaussianPuff(atm, source, 50, [1, 1, 1]);
            puff.center.x.should.be.equal(1);
            puff.center.y.should.be.equal(1);
        });
    });

    describe("Distance functions", () => {
        beforeEach((done) => {
            let atm = new db.Dispersion.Atmosphere([1, 1], .5, 65, 288);
            let source = new db.Dispersion.Source(
                db.Dispersion.SourceType.POINT,
                Number.POSITIVE_INFINITY,
                20,
                5,
                350,
                5
            );
            puff = new db.Dispersion.DynamicGaussianPuff(atm, source, 50);
            done();
        });

        it('should calculate distance traveled from start', () => {
            puff.distanceFromStart.should.be.equal(0);
            puff.step(60); // Move one minute
            puff.distanceFromStart.should.be.above(0);
        });

        it('should not mutate data', () => {
            puff.distanceFromStart.should.be.equal(0);
            puff.step(60); // Move one minute
            let orig = puff.center.clone();
            puff.distanceFromStart.should.be.above(0);
            orig.equals(puff.center).should.be.true;
        });

        it('should calculate distance total traveled with changing wind', () => {
            let atm = puff.atmosphere;
            atm.setWindSpeed([2, 2]);
            puff.step(60);
            atm.setWindSpeed([1,4]);
            puff.step(60);
            atm.setWindSpeed([2, 8]);
            puff.step(60);
            puff.distanceTraveled.should.be.above(puff.distanceFromStart);
            console.log(`Puff has traveled ${puff.distanceTraveled}m total`);
        });
    });

});