const execSync = require('child_process').execSync;

const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const _ = require('lodash');
const pkg = require('../utils/package');
const read = require('../utils/read');
const unique = require('../utils/unique');
const baseUrl = require('../utils/baseUrl');
const _if = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');


const rootFontSize = 16;



const DEBUG = {
  rem: rootFontSize,
  read: read,
  require: require,
  unique: unique(),
  version: pkg.getVersion,
  projectName: pkg.getProjectName(),
  projectDescription: pkg.getProjectDescription(),
  project_id: pkg.getProjectId(),
  _: _,
  assign: _.assign,
  debug: true,
  release: false,
  oAuth: true,
  base_url: base_url('/'),
  route: {},
  copyright: 'app/components/copyright.json',
  php: false,
  isBitrix: function () {return info.isBitrix;}
};
const RELEASE = _.assign({}, DEBUG, {
  // oAuth: false,
  debug: false,
  php: false,
  base_url: base_url(''),
  release: true
});
const DEV = _.assign({}, RELEASE, {
  oAuth: true,
  //TODO подставить id проекта
  base_url: base_url(getProjectDirById(pkg.getProjectId()))
});

function getProjectDirById(id) {
  return `/20${id.substr(0,2)}/${id}/`;
}

const BITRIX = _.assign({}, RELEASE, {
  //base_url: base_url("/dev/"),
  copyright: 'app/components/copyright_bitrix.json'
});

const _browserify = {};


function base_url(_base_url) {
  return  function(str, suffix){
    return (suffix ? suffix + '/' : '' ) + (_base_url + (str || '')).replace(/\/{2}/g, '/');
  }
}



function getBrowserify(entry) {
  if (!entry) return _browserify;
  if (_browserify[entry]) return _browserify[entry];

  let customOpts = {
    entries: [entry],//'./app/scripts/main.js'],
    debug: info.isServe || info.isDev,
    transform: ['babelify']
  };
  if (info.isServe) {
    customOpts.plugin = [watchify];
  }
  let opts = _.assign({}, watchify.args, customOpts);
  let b = _browserify[entry] = browserify(opts);
  // let _replace = pathReplace(__dirname);

  /*if (!info.isServe) {
    b.pipeline.get('deps').push(require('through2').obj(
      function (row, enc, next) {
        let dep = _replace(row.file || row.id);

        console.log('\x1b[32m%s\x1b[0m', dep);
        next();
      }
    ));
  }*/
  return b;

  function pathReplace(dir) {
    dir = require('path').resolve(dir, '../../');
    return path=>path.replace(dir, '');
  }
}

function getPugData() {
  return info.isServe
    ? DEBUG
    : info.isDev
      ? DEV
      : info.isBitrix
        ? BITRIX
        : RELEASE
}

let info = module.exports = {

  init: function(params){
    return function configInit(cb){
      _.assign(info, params);
      cb();
    }
  },

  plumber: ()=>plumber({errorHandler: notify.onError('Error: <%= error.message %>')}),


  getDestination: (dir) =>
    info.isBitrix
      ? `./dist/local/templates/${require('./bitrix').bitrixTemplateName()}/${dir}`
      : baseUrl(dir, 'dist')
      //  Тут изменен конфиг! Изначально тут был просто 'dist', но для работы докера потребовалось создать одну вложенную директорию (Для корректного очищения dist при ребилде)
  ,

  rootFontSize: rootFontSize,
  author: (function(){
    let author;
    return function () {
      return author = author || _.trim(String(execSync('git config user.name')));
    }
  }()),

  isServe: false,
  isDev: false,
  isBitrix: false,
  noVersion: false,

  getBrowserify: getBrowserify,
  sourcemaps: {
    init: ()=>_if(info.isServe, sourcemaps.init()),
    write: ()=>_if(info.isServe, sourcemaps.write())
  },
  pug: {
    pretty: true,
    getData: getPugData
  }
};
