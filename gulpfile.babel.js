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
import header from 'gulp-header';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import jetpack from 'fs-jetpack';

const pkg = require('./package.json');
const buildDir = jetpack.cwd('./build');
const distDir = jetpack.cwd('./dist');

const banner = ['/*!\n',
  ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
  ' */\n',
  ''
].join('');

gulp.task('clean', function() {
    buildDir.dirAsync('.', {empty: true});
    return distDir.dirAsync('.', {empty: true});
});

gulp.task('minify-dist', () => {
   return gulp.src('dist/Dirtybomb.js')
     .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(header(banner, { pkg: pkg }))
     .pipe(rename({ suffix: '.min' }))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('dist'))
});
