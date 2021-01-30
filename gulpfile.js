const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const GulpCleanCss = require('gulp-clean-css');
const GulpUglify = require('gulp-uglify');
const rename = require('gulp-rename');
const GulpConcat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

// Sass

function styles() {
  return src(['./src/sass/**/*.scss', '!./src/sass/widget.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(GulpCleanCss())
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
    .pipe(GulpConcat('project.js'))
    .pipe(GulpUglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest('./dist/js'))
}

// Image Optimization
function image() {
  return src('./src/img/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(dest('./dist/img/'))
}

// Watch task with BrowserSync

function serve() {
  browserSync.init({
    server: './',
    browser: 'google chrome'
  })
  watch(['./src/sass/**/*.scss', '**/*.html', './src/js/**/*.js'], series(styles, javascript)).on('change', browserSync.reload)
}

exports.styles = styles;
exports.serve = serve;
exports.image = image;