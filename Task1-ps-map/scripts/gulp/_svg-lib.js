const gulp = require('gulp');
const svgSymbols = require('gulp-svg-symbols');
const CONFIG = require('./config');

/**
 * Создание библиотеки svg изображений
 * @return {*}
 */
function svg() {
  return gulp.src('app/components/project/svg/symbols/*.svg')
    .pipe(CONFIG.plumber())
    .pipe($.filter(function (file) {
      return file.stat && file.stat.size
    }))
    .pipe(svgSymbols({
      title: false,
      id: 'svg_%f',
      className: '.svg_%f',
      fontSize: 0
    }))
    .pipe($.if('*.css', $.rename('_symbols.scss')))
    .pipe(gulp.dest('app/components/project/svg'))
}

module.exports = svg;
