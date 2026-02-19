const gulp = require("gulp");
const eslint = require("gulp-eslint");

module.exports = ()=> gulp.src("./app/components/**/*.js")
  .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(eslint.format());
