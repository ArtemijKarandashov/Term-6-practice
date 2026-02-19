const gulp = require('gulp');

const _ = require('lodash');
const pxtorem = require('gulp-pxtorem');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');

const sassInlineImage = require('../sass/sassInlineImage');
const sassMath = require('../sass/sassMath');
const sassImporter = require('../sass/sassImporter');
const baseUrl = require('../utils/baseUrl');

const CONFIG = require('./config');



module.exports = styles;

function styles() {
  /*var _pxtorem = pxtorem({
    rootValue: CONFIG.rootFontSize,
    unitPrecision: 4,
    propList: ["*"],
    replace: true,
    mediaQuery: true
  });*/
  let bundle = gulp.src(['app/styles/*.scss', '!app/styles/_*.scss'])
      .pipe(CONFIG.plumber())
      // .pipe(CONFIG.sourcemaps.init())
      .pipe(sass.sync({
        outputStyle: CONFIG.isServe ? 'expanded' : 'compressed',
        functions: _.assign({}, sassInlineImage({ /* options */ }), sassMath()),
        importer: sassImporter(),
        precision: 10,
        includePaths: ['.']
      }).on('error', sass.logError))
      .pipe(csso({forceMediaMerge: true}))
    // .pipe(CONFIG.sourcemaps.write())
    /*.pipe(_pxtorem)*/;

  if (CONFIG.isServe) {
    bundle = bundle
      .pipe(gulp.dest(baseUrl('styles', '.tmp')))
      .pipe(browserSync.stream());
  } else {
    bundle = bundle
      .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
      }))
      .pipe(gulp.dest( CONFIG.getDestination('styles') ) );
  }

  return bundle;
}
