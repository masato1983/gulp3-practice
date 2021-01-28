const { src, dest } = require('gulp');
const sass = require('gulp-sass');

function styles() {
  return src('./src/sass/main.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'))
}

exports.styles = styles;