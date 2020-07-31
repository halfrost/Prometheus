var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssvariables = require('postcss-css-variables');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var wait = require('gulp-wait');
var merge = require('merge2');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
// 错误处理
var plumber = require("gulp-plumber");
var stylish = require("jshint-stylish");

var del = require('del');
var zip = require('gulp-zip');
var beautify = require('gulp-jsbeautifier');
var browserSync = require('browser-sync').create();

gulp.task('beautify', () =>
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(beautify())
);

// JS检查
gulp.task('lint', function() {
    return gulp.src('./assets/js/index.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    var sassStream = gulp.src('./assets/scss/screen.scss')
    .pipe(plumber())
    .pipe(wait(100))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssvariables({preserve: true})]));
    var cssStream = gulp.src([
        './assets/css/bootstrap.min.css',
        './assets/css/hl-styles/atom-one-dark.min.css'
    ], { allowEmpty: true })
    .pipe(concat('css-files.css'));
    return merge(cssStream, sassStream)
    .pipe(concat('app.bundle.min.css'))
    .pipe(cleanCSS({
        level: {1: {specialComments: 0}},
        compatibility: 'ie9'}))
    .pipe(rename("bundle-css.hbs"))
    .pipe(gulp.dest('./partials/styles'))
    .pipe(browserSync.stream());
});

gulp.task('ampcss', function() {
    return gulp.src(['./assets/scss/ampstyle-light.scss', './assets/scss/ampstyle-dark.scss'])
    .pipe(plumber())
    .pipe(wait(100))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssvariables()]))
    .pipe(cleanCSS({
        level: {1: {specialComments: 0}},
        compatibility: 'ie9'}))
    .pipe(rename({extname: ".hbs"}))
    .pipe(gulp.dest('./partials/styles'));
});

gulp.task('concat-js', function() {
    return gulp.src([
        './assets/js/vendor/jquery-3.5.1.min.js',
        './assets/js/vendor/jquery.fitvids.js',
        // './assets/js/vendor/highlight.pack.js',
        './assets/js/vendor/fuse.min.js',
        './assets/js/vendor/medium-zoom.min.js',
        './assets/js/vendor/clipboard.min.js',
        './assets/js/vendor/jquery.disqusloader.js',
        './assets/js/vendor/jquery.toc.js',
        './assets/js/vendor/lazy.js',
        './assets/js/vendor/prism.js',
        './assets/js/index.js',
    ], { allowEmpty: true })
    .pipe(plumber())
    .pipe(concat('app.bundle.min.js'))
    .pipe(uglify({
        compress: {
            drop_console: true
        }
    })) // 压缩成一行
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('watch', gulp.series('css', 'ampcss', 'concat-js', function () {
    browserSync.init({
        proxy: "http://localhost:2368"
    });
    gulp.watch(['./assets/scss/**/*.scss', '!./assets/scss/ampstyle-light.scss', '!./assets/scss/ampstyle-dark.scss'], { allowEmpty: true }).on('change', gulp.series('css'));
    gulp.watch(['./assets/scss/ampstyle-light.scss', './assets/scss/ampstyle-dark.scss']).on('change', gulp.series('ampcss'));
    gulp.watch(['./assets/js/**/*.js', '!./assets/js/app.bundle.min.js'], { allowEmpty: true }).on('change', gulp.series('concat-js', browserSync.reload));
    gulp.watch('./**/*.hbs').on('change', browserSync.reload);
}));

gulp.task('clean', function() {
    return del(['./build', './dist']);
});

gulp.task('build', gulp.series('clean','lint', 'css', 'concat-js', function () {
    var targetDir = 'build/';

    return gulp.src([
        '**',
        '!assets/scss', '!assets/scss/**/*',
        '!assets/css', '!assets/css/**/*',
        'assets/js/**', '!assets/js/vendor', '!assets/js/vendor/**/*',
        '!node_modules', '!node_modules/**',
        '!build', '!build/**',
        '!dist', '!dist/**'
    ])
    .pipe(gulp.dest(targetDir));
}));

gulp.task('zip', function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        './build/**/*'
    ])
    .pipe(zip(filename))
    .pipe(gulp.dest(targetDir));
});

gulp.task('upload', gulp.series('clean','build', 'zip'));

gulp.task('default', gulp.parallel('watch'));