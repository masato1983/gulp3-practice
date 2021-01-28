const { src, dest } = require('gulp');
const sass = require('gulp-sass');

function styles() {
  return src(['./src/sass/**/*.scss', '!./src/sass/widget.scss'])
    .pipe(sass())
    .pipe(dest('./dist/css'))
}

exports.styles = styles;