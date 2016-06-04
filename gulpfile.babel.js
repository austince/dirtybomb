/**
 * Created by austin on 6/3/16.
 * 
 * Really not too happy with babel and rollup. They do not play nice.
 * During the compilation tasks, the task stops half way without throwing errors,
 * or doing any of its job.
 * 
 */
"use strict";

import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import rollup from 'gulp-rollup';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import util from 'gulp-util';

const jetpack = require('fs-jetpack');
const minify = require('gulp-minify');
const  exec = require('child_process').exec;

const karmaServer = require('karma').Server;
const buildDir = jetpack.cwd('./build');
const distDir = jetpack.cwd('./dist');

gulp.task('clean', function() {
    buildDir.dirAsync('.', {empty: true});
    return distDir.dirAsync('.', {empty: true});
});

/*
gulp.task('compileGaussian', ['clean'], function(cb) {
    /!*rollup({
        entry: 'src/GaussianPlume/GaussianPlume.js',
        plugins: [
            babel({
                exclude: 'node_modules/!**'
            })
        ]
    }).then(function(bundle) {
        "use strict";
        bundle.write({
            dest: 'dist/GaussianPlume.js',
            sourceMap: true
        })
    });*!/
    /!*exec('rollup -f umd -n gaussianPlume -o dist/GaussianPlume.js -- src/GaussianPlume/GaussianPlume.js',
        {cwd: __dirname}, 
        function(error, stdout, stderr) {
            if (error) {
                cb(error);
            }
    });*!/
});

gulp.task('compileDirty', ['clean'], function(cb) {
    /!*gulp.src('src/index.js')
        .pipe(rollup({
            sourceMap: true,
            format: 'iife',
            plugins: [
                rollupIncludePaths(includePathOptions)
            ]
        }))
        .pipe(babel())
        .on('error', util.log)
        .pipe(header(headerBanner))
        .pipe(rename('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));*!/


    var rolled = gulp.src('index.js')
        .pipe(rollup({
            sourceMap: true,
            format: 'umd'
        }));
    var transpiled = rolled.pipe(babel())
        .on('error', function(error) {
            console.log(error);
        });

    var mapped = transpiled.pipe(sourcemaps.write('.'))

    var written = mapped.pipe(gulp.dest('dist'));

    return written;
    
    /!*exec('rollup -f umd -n dirtybomb -o dist/Dirtybomb.js -- index.js',{cwd: __dirname}, function(error, stdout, stderr) {
        if (error) {
            cb(error);
        }
    });*!/
});
*/

/**
 * 
 */
gulp.task('compress', ['compile'], function() {
    return gulp.src(distDir.path())
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            ignoreFiles: []
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', () => {
});