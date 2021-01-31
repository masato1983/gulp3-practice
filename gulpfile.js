const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const pug = require('gulp-pug');
const plumber = require("gulp-plumber");
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const zip = require('gulp-zip');
const del = require('del')

filesPath = {
  sass: './src/sass/**/*.scss',
  js: './src/js/**/*.js',
  images: './src/img/**/*.+(png|jpg|gif|svg)',
  pug:  './src/templates/**/*.pug'
}

// pug

function buildHTML() {
  return src([filesPath.pug, '!./src/templates/includes/*.pug', '!./src/templates/extends/*.pug'])
    .pipe(plumber())
    .pipe(pug())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('./dist'))
}

// Sass

function styles() {
  return src([filesPath.sass, '!./src/sass/widget.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
    .pipe(rename(function(path) {
      if (!path.extname.endsWith('.map')) {
        path.basename += '.min'
      }}))
    .pipe(dest('./dist/css'))
}

// Javascript

function javascript() {
  return src(['./src/js/project.js', './src/js/alert.js'])
    .pipe(concat('project.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./dist/js'))
}

// Image Optimization

function image() {
  return src(filesPath.images)
    .pipe(cache(imagemin()))
    .pipe(dest('./dist/img/'))
}

// Watch task with BrowserSync

function serve() {
  browserSync.init({
    server: './dist',
    browser: 'google chrome'
  })
  watch([filesPath.pug, filesPath.sass, filesPath.js, filesPath.images], parallel(buildHTML, styles, javascript, image)).on('change', browserSync.reload)
}

// Clear cache

function clearCache(done) {
  return cache.clearAll(done);
}

// zipfile

function zipfile() {
  return src(['./**/*', '!./node_modules/**/*'])
    .pipe(zip('project.zip'))
    .pipe(dest('./'))
}

// Clean "dist" folder

function clean() {
  return del(['./dist/**/*'])
}

// exports

exports.default = series(clean, buildHTML, styles, javascript, image, serve);
exports.clearCache = clearCache;
exports.zipfile = zipfile;
