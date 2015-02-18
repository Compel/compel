import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'gulp-browserify';
import rename from 'gulp-rename';
import babelify from 'babelify';
import {join as joinPath} from 'path';

gulp.task('build', () => {
  return gulp
    .src('lib/browser/index.js')
    .pipe(sourcemaps.init())
    .pipe(rename('scomp.js'))
    .pipe(browserify({
      transform: babelify,
      standalone: 'scomp'
    }))
    .on('error', console.error)
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(joinPath(__dirname, 'build')));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(joinPath(__dirname, 'lib', '**', '*.js'), ['build']);
});

gulp.task('default', ['build']);
