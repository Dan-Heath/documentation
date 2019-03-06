var gulp = require('gulp'),
	autoprefixer = require('autoprefixer'),
	folders = require('gulp-folders-4x'),
	imagemin = require('gulp-imagemin'),
	imageResize = require('gulp-image-resize'),
	jsonlint = require('gulp-jsonlint'),
	path = require('path'),
	postcss = require('gulp-postcss');

var site = '/site/';

gulp.task('css', folders(site, function(folder) {
	var processors = [
		autoprefixer({
			browsers: ['last 2 versions', '> 5%']
		})
	];

	return gulp.src(path.join(site, folder, 'assets', 'css', '*.css'))
		.pipe(postcss(processors))
		.pipe(gulp.dest(path.join(site, 'assets', 'css')));
}));

gulp.task('img:resize', folders(site, function(folder) {
	var paths = [
		path.join(site, folder, 'assets', 'img', '*.*'),
		path.join(site, folder, 'images', '*.*'),
		path.join(site, folder, 'images', '**', '*.*')
	];

	return gulp.src(paths)
		.pipe(imageResize({
			width: 1024,
			upscale : false
		}))
		.pipe(gulp.dest(path.join(site, 'images')));
}));

gulp.task('img:minify', gulp.series('img:resize', folders(site, function(folder) {
	var paths = [
		path.join(site, folder, 'assets', 'img', '*.*'),
		path.join(site, folder, 'images', '*.*'),
		path.join(site, folder, 'images', '**', '*.*')
	];

	return gulp.src(paths)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
		}))
		.pipe(gulp.dest(path.join(site, 'images')));
})));

gulp.task('jsonlint', function() {
	return gulp.src('./*.json')
		.pipe(jsonlint())
		.pipe(jsonlint.failAfterError());
});

gulp.task('post-process', gulp.parallel('css', 'img:minify'));
gulp.task('lint', gulp.series('jsonlint'));
