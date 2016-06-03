/**
 * Created by austin on 6/3/16.
 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const jetpack = require('fs-jetpack');
const karmaServer = require('karma').Server;

const distDir = jetpack.cwd('./dist');

gulp.task('clean', function() {
    return distDir.dirAsync('.', {empty: true});
});

gulp.task('build', ['clean'], function() {
    return gulp.src(['src/*.js', 'src/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('tests', ['build'], function(done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['build', 'tests'], function() {});