import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'gulp-browserify';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import babelify from 'babelify';
import {join as joinPath} from 'path';

const BUILD_DIR = joinPath(__dirname, 'build');

gulp.task('build', () => {
  return gulp
    .src(joinPath(__dirname, 'lib', 'browser', 'index.js'))
    .pipe(sourcemaps.init())
    .pipe(rename('compel.js'))
    .pipe(browserify({
      transform: babelify,
      standalone: 'compel'
    }))
    .on('error', console.error)
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('min', ['build'], () => {
  return gulp
    .src(joinPath(BUILD_DIR, 'compel.js'))
    .pipe(rename('compel.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(joinPath(__dirname, 'lib', '**', '*.js'), ['build']);
});

gulp.task('default', ['min']);
