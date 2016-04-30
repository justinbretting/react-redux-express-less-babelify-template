'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var errorify = require('errorify');
var streamify = require('streamify');
var rename = require('gulp-rename'); // Rename sources
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');
var moment = require('moment');
var livereload = require('gulp-livereload'); // Livereload support for the browser

var config = {
  js: {
    src: './src/main.jsx',
    watch: './src/**/*',
    outputDir: './public/',
    outputFile: 'main.js'
  }
}

// Error reporting function
function mapError(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message));
  }
}

// Completes the final file outputs
function bundle(bundler) {
  var bundleTimer = duration(moment().format('hh:mm:ss') + ': Bundle complete');

  bundler
  .bundle()
  .on('error', mapError) // Map error reporting
  .pipe(source('main.jsx')) // Set source name
  .pipe(buffer()) // Convert to gulp pipeline
  .pipe(bundleTimer) // Output time timing of the file creation
  .pipe(rename(config.js.outputFile)) // Rename the output file
  .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
}

// Gulp task for build
gulp.task('babelify-dev', function() {
  livereload.listen(); // Start livereload server
  var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

  var bundler = browserify(config.js.src, args) // Browserify
  .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
  .transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

  bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

  bundler.on('update', function() {
    bundle(bundler); // Re-run bundle on source updates
  });
});

gulp.task('less-dev', function () {
  return gulp.src('./less/main.less')
    .pipe(watchLess('./less/main.less'))
    .pipe(less())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch-less', function() {
  gulp.watch('./**/*.less', ['less-dev']);  // Watch all the .less files, then run the less task
});

var VENDOR_CSS = [
  './node_modules/react-colors-picker/assets/index.css',
  './node_modules/rc-switch/assets/index.css'
]

gulp.task('vendor-css', function () {
  return gulp.src(VENDOR_CSS)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch-css', function() {
  gulp.watch(VENDOR_CSS, ['vendor-css']);  // Watch all the .css files, then run the css task
});

gulp.task('bundle-dev', ['babelify-dev', 'less-dev', 'watch-less', 'vendor-css', 'watch-css']);


/*
 pseudo-demarcation between dev bundling and production bundling
*/

gulp.task('less-prod', function () {
  return gulp.src('./less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('babelify-prod', function() {
  var bundleTimer = duration('bundle time');
  var bundler = browserify(config.js.src) // Browserify
  .transform(babelify, {presets: ['es2015', 'react']}); // Babel transforms

  bundler
  .bundle()
  .on('error', mapError) // Map error reporting
  .pipe(source('main.jsx')) // Set source name
  .pipe(buffer()) // Convert to gulp pipeline
  .pipe(uglify())
  .pipe(bundleTimer)
  .pipe(rename(config.js.outputFile)) // Rename the output file
  .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
});

gulp.task('bundle-prod', ['babelify-prod','vendor-css','less-prod']);
