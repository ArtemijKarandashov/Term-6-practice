const gulp = require('gulp');
const bitrix = require('./bitrix');
const baseUrl = require('../utils/baseUrl');
const CONFIG = require('./config');

let tasks = [copyAssetsRoot, copyAssetsTemplateFiles];

module.exports = {
  copyAssets,
  add:(...arr)=>{
    tasks = tasks.concat(arr);
  }
};

function copyAssets(cb) {
  gulp.series(gulp.parallel.apply(null, tasks)).apply(this, arguments);
}

function assets(_glob, dst) {
  const params = {
    'dot': true,
    'nodir': true,
    'base': 'app'
  };

  return gulp.src(addIgnore(_glob), params)
    .pipe(gulp.dest(dst));
}

function copyAssetsRoot() {
  return assets([
    'app/*',
    '!app/*.{html,pug}',
    'app/{data,content}/**/*',
    '!app/{data,content}/$**/*',
    'app/assets/**/*',
    'app/video*/**/*'
  ], baseUrl('', 'dist'));
}


function copyAssetsTemplateFiles() {
  return assets(
    [
      'app/{scripts,styles}/libs/**/*',
      'app/fonts/**/*',
      'app/images/**/*',
    ],
    CONFIG.getDestination('')
  );
}


function addIgnore(list){
  return list.concat([
    '!app/**/bak*/**/*',
    '!app/**/*.{bak,fla}',
    '!app/**/bak*.*',
    '!app/**/.gitignore',
    '!app/**/.npmignore'
  ])
}
