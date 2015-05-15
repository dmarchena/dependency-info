var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
  return gulp
  	.src(['./*.js', './test/**/*.js'])
  	.pipe(jshint())
  	.pipe(jshint.reporter(stylish))
  	.pipe(jshint.reporter('fail'));
});

gulp.task('test', ['lint'], function () {
  return gulp
  	.src('./test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('default', ['test']);