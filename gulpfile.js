var gulp = require('gulp')
var sass = require('gulp-sass')
var cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat')
var babelify = require('babelify')
var browserify = require('browserify')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserSync = require('browser-sync').create()

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('html', function() {
  return gulp.src('./src/html/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('fonts', function() {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts'))
})

// gulp.task('scripts', function() {
//   return gulp.src('./src/js/*.js')
//     .pipe(browserify({
//       transform: ['babelify']
//     }))
//     .pipe(concat('app.js'))
//     .pipe(gulp.dest('./dist/js'))
//     .pipe(browserSync.reload({
//       stream: true
//     }))
// })

gulp.task('scripts', function() {
  var b = browserify({
    entries: './src/js/activePage.js',
    debug: true,
    transform: [babelify.configure({
      presets: ['es2015']
    })]
  })

  return b.bundle()
    .pipe(source('./app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('css', function() {
  return gulp.src(['./src/css/*.css', './src/sass/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('images', function() {
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('watch', ['browserSync', 'build'], function() {
  gulp.watch('./src/html/**/*.html', ['html'])
  gulp.watch('./src/js/**/*.js', ['scripts'])
  gulp.watch(['./src/sass/**/*.scss', './src/css/*.css'], ['css'])
  gulp.watch('./src/img/*', ['images'])
  gulp.watch('./src/fonts/*', ['fonts'])
})

gulp.task('build', ['html', 'css', 'scripts', 'images', 'fonts'])

gulp.task('default', ['watch'])