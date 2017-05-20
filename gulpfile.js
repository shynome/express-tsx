const gulp = require('gulp')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('./tsconfig.json')
gulp.task('tsc',function(){
  require('child_process').exec('rm -r lib')
  return tsProject.src()
    .pipe(tsProject()).js
    .pipe(gulp.dest('lib'))
})