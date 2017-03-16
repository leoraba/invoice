var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  return gulp.
    src('./angularjs/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
  gulp.watch(['./angularjs/*.js'], ['browserify']);
});