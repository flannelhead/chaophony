var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    del = require('del');

gulp.task('clean', function(cb) { del('dist', cb); });

gulp.task('build', ['clean'], function() {
    var assets = useref.assets();

    return gulp.src('src/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest('dist'));
});

