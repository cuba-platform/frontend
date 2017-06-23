'use strict';

const gulp = require('gulp');
const typescript = require('gulp-typescript');
const mergeStream = require('merge-stream');


gulp.task('build', () => {
  const tsProject = typescript.createProject('tsconfig.json');
  const tsResult = gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .once("error", function () {
      this.once("finish", () => process.exit(1));
    });
  return mergeStream([
    tsResult.dts.pipe(gulp.dest('./')),
    tsResult.js.pipe(gulp.dest('./'))
  ]);
});

gulp.task('default', ['build']);