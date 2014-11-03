var gulp = require('gulp');

var duo = require('gulp-duojs');

gulp.task('compile', function () {
  gulp.src('src/debug.js')
    .pipe(duo({standalone: 'debug'}))
    .pipe(gulp.dest('./dest'));
});

