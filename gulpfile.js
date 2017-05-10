const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create();

const BASE_JS_DIR = 'src/assets/js';
const DEST_JS_DIR = 'dist/js';

const BASE_SASS_DIR = 'src/assets/scss';
const DEST_CSS_DIR = 'dist/css';

const BASE_IMG_DIR = 'src/assets/img';
const DEST_IMG_DIR = 'dist/img';

gulp.task('js', () => {
    return gulp.src(`${BASE_JS_DIR}/app.js`)
        .pipe(plugins.browserify({}))
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(plugins.concat('all.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(DEST_JS_DIR))
        .pipe(browserSync.stream())
})

gulp.task('lint', () => {
    const linter = plugins.eslint

    return gulp.src(`${BASE_JS_DIR}/**/*.js`)
        .pipe(linter())
        .pipe(linter.format())
        .pipe(linter.failAfterError())
})

gulp.task('sass', () => {
    return gulp.src(`${BASE_SASS_DIR}/**/*.scss`)
        .pipe(plugins.csscomb())
        .pipe(gulp.dest(`${BASE_SASS_DIR}/`))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.csso())
        .pipe(gulp.dest(DEST_CSS_DIR))
        .pipe(browserSync.stream())
})

gulp.task('image', () => {
    gulp.src(`${BASE_IMG_DIR}/**/*`)
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(DEST_IMG_DIR))
})

gulp.task('serve', ['js', 'sass', 'image'], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    let watcherJS = gulp.watch(`${BASE_JS_DIR}/**/*.js`, ['lint', 'js'])
    watcherJS.on('change', () => console.log("Compilation des fichiers js en cours..."))

    let watcherCSS = gulp.watch(`${BASE_SASS_DIR}/**/*.scss`, ['sass'])
    watcherCSS.on('change', () => console.log("Compilation des fichiers css en cours..."))

    let watcherImg = gulp.watch(`${BASE_IMG_DIR}/**/*`, ['image'])
    watcherImg.on('change', () => console.log("Optimisation des images en cours..."))

    let watcherHtml = gulp.watch(`./**/*.html`)
    watcherHtml.on('change', browserSync.reload)
})

gulp.task('default', ['serve']);