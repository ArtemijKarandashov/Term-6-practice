const _ = require('lodash');
const gulp = require('gulp');

const gulpPug = require('gulp-pug');
const gulpRename = require('gulp-rename');
const gulpIf = require('gulp-if');
const bitrix = require('./bitrix');
const baseUrl = require('../utils/baseUrl');
const CONFIG = require('./config');

module.exports = pug;

function pug() {
  let DATA = CONFIG.pug.getData();
  let bundle = gulp.src(['app/*.pug', '!app/**/_*.pug', 'app/extra/**/*.pug'], {dot: true})
    .pipe(CONFIG.plumber())
    .pipe(gulpPug({
      doctype: 'html',
      basedir: '.',
      data: _.assign({splitProperties, isTemplateEngine: 0}, DATA),
      pretty: CONFIG.pug.pretty
    }));

  if (CONFIG.isServe) {
    return bundle
      .pipe(gulp.dest(baseUrl('', '.tmp')))
      .pipe(require('browser-sync').stream());
  }

  bundle = bundle.pipe(require('../utils/appendVersion')(CONFIG.isDev ? Date.now() : ''));

  bundle = bitrix.initTemplate(bundle);

  return bundle
    .pipe(gulpRename(function (path) {
      // console.log(3, path.dirname, path.basename , path.extname);
      if (DATA.php) {
        path.extname = ".php";
      }
    }))
    .pipe(
      gulpIf(
        file=>/(\/|\\)extra\1/.test(file.path),
        gulp.dest('dist'),
        gulp.dest(baseUrl('', 'dist'))
      )
    );
}


/**
 * Удаляет из объекта obj свойства с ключами удовлетворяющими условию test и возвращает их в новом объекте
 * @param {Object} obj
 * @param {Array|RegExp|{test:Function}} test - объект содержащий функцию test (например RegExp), в которую передается * название ключа, и которая возвращает Boolean - удалять свойство или нет
 * @return {{}}
 */
function splitProperties(obj, test){
  if (Array.isArray(test)) {
    test = TestArray(test);
  }

  return Object.keys(obj).reduce((res, key)=>{
    if (test.test(key)) {
      res[key] = obj[key];
      delete obj[key];
    }
    return res;
  }, {});

  function TestArray(arr){
    return {
      test: itm=>arr.indexOf(itm) >= 0
    }
  }
}
