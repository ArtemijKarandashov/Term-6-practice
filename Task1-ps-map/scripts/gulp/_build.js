const gulp = require('gulp');

const styles = require('./_styles');
const scripts = require('./_scripts');
const pug = require('./_pug');
const clean = require('./_clean');
const increaseVersion = require('./_increaseVersion');
const pkg = require('../utils/package');
const {copyAssets} = require('./_assets');
const CONFIG = require('./config');

function build(cb){
  gulp.series(
    // Очистку директории пришлось вынести в rebuild-ps-map.sh т.к. контейнер не позволяет чистить диреторию средствами del
    // Альтернатива этому, создать вложенную директорию (Наример data/dist) и настроить gulp на работу с ней.
    // Однако, по какой то причине, в некоторых скриптах gulp не обращается к config файлу, а пути захардкожен.
    // gulp.parallel(clean, versioned(pkg.increaseVersion)),
    gulp.parallel(versioned(pkg.increaseVersion)),
    gulp.series(
      gulp.parallel(copyAssets, styles, scripts),
      pug,
      versioned(increaseVersion)
    )
  ).apply(this, arguments);
}


build.description = 'Сборка';
module.exports = build;


function versioned(fn) {
  return CONFIG.noVersion ? cb=>cb() : fn;
}
