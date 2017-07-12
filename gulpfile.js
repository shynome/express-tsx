const gulp = require('gulp')
const exec = (cammand)=>new Promise((rl,rj)=>require('child_process').exec(cammand,rl))
gulp.task(
  'build',
  ()=>Promise.resolve(1)
  .then(()=>exec('rm -r lib'))
  .then(()=>exec('tsc -p src'))  
)