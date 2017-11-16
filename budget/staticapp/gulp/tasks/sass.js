var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');


module.exports = function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./../static/budget/css"));
};
