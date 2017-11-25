const gulp = require('./gulp')([
  'dev',
  'build',
]);

gulp.task('default', ['dev']);
