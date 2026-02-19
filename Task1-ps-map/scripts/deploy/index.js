const gulp = require('gulp');
const fs = require('fs');

const getGitBranch = require('./getGitBranch');
const getParams = require('./getParams');
const getTasks = require('./getTasks');

const DEPLOY = ['dist/**/*', {base: 'dist', buffer: false}];


async function main(){
  let branch = await getGitBranch();
  let params = await getParams(branch);
  let tasks = getTasks(params);

  if (tasks) {
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }
    if (tasks.length) {
      return tasks.reduce(
        (src, filter)=>src.pipe(filter),
        gulp.src(...DEPLOY)
      );
    }

  }
}

function saveCommitData(cb) {
  const date = new Date();
  date.setTime(Date.now() + 3*60*60*1000);
  fs.appendFile("./app/deploy-log.txt", `${process.env.CI_COMMIT_REF_NAME} ${process.env.CI_COMMIT_SHA} ${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${process.env.GITLAB_USER_EMAIL} \n`, function (err) {
    if (err) {
      return console.log(err);
    }
    cb();
  });
}

module.exports = async function(){
  let branch = await getGitBranch();
  return gulp.series(saveCommitData,branch === 'master' ? 'build' : `build_${branch}`, main)(...arguments);
};
