import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'gulp-browserify';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import babelify from 'babelify';
import concat from 'gulp-concat';
import {join as joinPath} from 'path';

const BUILD_DIR = joinPath(__dirname, 'build');
const BOWER_DIR = joinPath(__dirname, 'bower_components');

gulp.task('build', ['ie8'], () => {
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

gulp.task('min', ['build', 'ie8:min'], () => {
  return gulp
    .src(joinPath(BUILD_DIR, 'compel.js'))
    .pipe(rename('compel.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(joinPath(__dirname, 'lib', '**', '*.js'), ['build']);
});

gulp.task('ie8', () => {
  return gulp
    .src([
      joinPath(BOWER_DIR, 'es5-shim', 'es5-shim.js'),
      joinPath(BOWER_DIR, 'es5-shim', 'es5-sham.js'),
      joinPath(BOWER_DIR, 'event-listener-polyfill', 'EventListener.js'),
      joinPath(BOWER_DIR, 'html5shiv', 'dist', 'html5shiv.js')
    ])
    .pipe(concat('compel-ie8.js'))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('ie8:min', ['ie8'], () => {
  return gulp
    .src(joinPath(BUILD_DIR, 'compel-ie8.js'))
    .pipe(uglify())
    .pipe(rename('compel-ie8.min.js'))
    .pipe(gulp.dest(BUILD_DIR));
})

gulp.task('default', ['min']);
