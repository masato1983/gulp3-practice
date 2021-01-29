const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const cleanCss = require('gulp-clean-css');

function styles() {
  return src(['./src/sass/**/*.scss', '!./src/sass/widget.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css'))
}

function serve() {
  browserSync.init({
    server: './',
    browser: 'google chrome'
  })
  watch(['./src/sass/**/*.scss', '**/*.html'], series(styles)).on('change', browserSync.reload)
}

exports.styles = styles;
exports.serve = serve;