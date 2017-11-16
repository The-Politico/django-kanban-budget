var gulp = require('./gulp')([
  'sass',
  'browserify',
  'watch',
]);

gulp.task('build', ['sass', 'browserify', 'watch']);
gulp.task('default', ['build']);
