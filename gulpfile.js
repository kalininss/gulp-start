var browserSync 	= require("browser-sync"),				// web server
		gulp 					= require("gulp"),								// main var
		autoprefixer 	= require("gulp-autoprefixer"),		// add vendor prefixes
		gulpIf 				= require("gulp-if"),							// run uglify or minify on useref task
		// rename 				= require("gulp-rename"),					// 
		sass 					= require("gulp-sass"),						// compile scss to css
		sourcemaps 		= require("gulp-sourcemaps"),			//
		template 			= require("gulp-template-html"),	// create html files based on 1 template
		uglify 				= require("gulp-uglify"),					// for minify js
		cssnano				= require("gulp-cssnano"),				// for minify css
		imagemin			= require("gulp-cssnano"),				// for minify css
		useref 				= require("gulp-useref");					// concat js and css


/* create css files and add vendor prefixes */
gulp.task('sass', function() {
	return gulp.src('./src/sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expand'}).on("error", sass.logError))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({stream: true}));
});


/* concat all css and js */
gulp.task('useref', function() {
	return gulp.src('dist/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});


/* create normal html files by template */
gulp.task('html', function() {
	return gulp.src(['src/templates/*.html', '!src/templates/_template.html'])
		.pipe(template('src/templates/_template.html'))
		.pipe(gulp.dest('src'))
		.pipe(browserSync.reload({stream: true}));
});


/* watch files and start web server */
gulp.task('default', ['sass', 'html'], function() {
	browserSync({server: './src'});

	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/*.html', ['html']);
});


/* move files to dist directory */
gulp.task('build', ['useref', 'imagemin'], function() {

	var buildFiles = gulp.src([
		'src/.htaccess',
		'src/favicon.ico',
	]).pipe(gulp.dest('dist'));

	var buildImg = gulp.src([
		'src/img/**/*',
		'!src/img/**/*.jpg',
		'!src/img/**/*.png',
	]);

	var buildFonts = gulp.src([
		'src/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));

});


/* image optimize */
gulp.task('imagemin', function() {
	return gulp.src(['app/img/**/*.jpg', 'app/img/**/*.png'])
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img')); 
});