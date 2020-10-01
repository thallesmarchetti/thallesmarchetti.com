'use strict';

const browserSync = require('browser-sync'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	env = require('minimist')(process.argv.slice(2)),
	gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-htmlmin'),
	nunjucksRender = require('gulp-nunjucks-render'),
	plumber = require('gulp-plumber'),
	stylus = require('gulp-stylus'),
	jeet = require('jeet'),
	rupture = require('rupture'),
	koutoSwiss = require('kouto-swiss'),
	prefixer = require('autoprefixer-stylus'),
	mergeStream = require('merge-stream'),
	uglify = require('gulp-uglify');


gulp.task('nunjucks', done => {
	return gulp.src(['app/views/*.njk'])
		.pipe(plumber())
		.pipe(nunjucksRender({ path: ['app/views'] }))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('public/'));
		done();
});

gulp.task('stylus', done => {
	gulp.src('app/stylus/main.styl')
		.pipe(plumber())
		.pipe(stylus({
			use: [koutoSwiss(), prefixer(), jeet(), rupture()],
			compress: true
		}))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({ stream: true }))
		.pipe(gulp.dest('public/css'));
		done();
});

gulp.task('js', () => {
	return gulp.src('app/javascript/**/*.js')
		.pipe(plumber())
		.pipe(babel({ presets: ['env'] }))
		.pipe(uglify())
		.pipe(concat('index.js'))
		.pipe(gulp.dest('public/js/'))
});

gulp.task('images', done => {
	gulp.src('app/images/**/*')
		.pipe(plumber())
		.pipe(imagemin({ interlaced: true, progressive: true, optimizationLevel: 2 }))
		.pipe(gulp.dest('public/images'));
		done();
});

gulp.task('vendor', () => {
	return mergeStream(
		gulp.src(['./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
			'./node_modules/scrollreveal/dist/scrollreveal.min.js'])
			.pipe(gulp.dest('public/vendor'))
	);
});

gulp.task('manifest', () => {
	return mergeStream(
		gulp.src('app/views/manifest.json')
			.pipe(gulp.dest('public/'))
	);
});

gulp.task('themes', () => {
	return mergeStream(
		gulp.src('app/Themes/**/*')
			.pipe(gulp.dest('public/Themes'))
	);
});

gulp.task('watch', done => {
	gulp.watch('app/views/**/*.njk', gulp.parallel(['nunjucks']));
	gulp.watch('app/stylus/**/*.styl', gulp.parallel(['stylus']));
	gulp.watch('app/js/**/*.js', gulp.parallel(['js']));
	gulp.watch('app/images/**/*.{jpg,png,gif}', gulp.parallel(['images']));
	done();
});

gulp.task('browser-sync', () => {
	let files = [
		'public/**/*.html',
		'public/css/**/*.css',
		'public/img/**/*',
		'public/js/**/*.js'
	];

	browserSync({
		files: ['./public/**/*.*'],
		port: 8080,
		server: {
			baseDir: 'public'
		}
	});
});


gulp.task('default', gulp.series('nunjucks', 'js', 'stylus', 'images', 'vendor', 'watch', 'browser-sync'));
gulp.task('build', gulp.series('nunjucks', 'js', 'stylus', 'images', 'vendor', 'manifest', 'themes'));
