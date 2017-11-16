const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const es = require('event-stream');
const path = require('path');
const glob = require('glob');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const gutil = require('gulp-util');
const babelify = require('babelify');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const babili = require('gulp-babili');

module.exports = (done) => {
  glob('./src/js/main-**.{js,jsx}', (err, files) => {
    if (err) done(err);

    const tasks = files.map((entry) => {
      const props = {
        entries: [entry],
        extensions: ['.js', '.jsx'],
        cache: {},
        packageCache: {},
        debug: true,
      };

      const bundler = browserify(props)
                      .transform(babelify, {
                        presets: ['es2015', 'react'],
                      });

      function bundle() {
        return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(path.basename(entry)))
        .pipe(buffer())
        .pipe(gulpif(argv.production, sourcemaps.init({ loadMaps: true })))
        .pipe(gulpif(argv.production, babili({
          removeConsole: true,
          mangle: {
            keepClassNames: true,
          },
        }).on('error', gutil.log)))
        .pipe(rename({
          extname: '.bundle.js',
        }))
        .pipe(gulpif(argv.production, sourcemaps.write('./')))
        .pipe(gulp.dest('./../static/budget/js/'));
      }

      bundler.on('log', gutil.log);
      bundler.on('update', bundle);
      return bundle();
    });

    es.merge(tasks).on('end', done);
  });
};
