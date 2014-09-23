// File: Gulpfile.js
'use strict';

var gulp 	= require('gulp'),
	connect = require('gulp-connect'),
	stylus	= require('gulp-stylus'),
	nib		= require('nib'),
	jshint	= require('gulp-jshint'),
	stylish	= require('jshint-stylish'),
	inject	= require('gulp-inject'),
	wiredep	= require('wiredep').stream,
	historyApiFallBack = require('connect-history-api-fallback');

// Servidor web de desarrollo
gulp.task('server', function() {
	connect.server({
		root: './app',
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function(connect, opt) {
			return [historyApiFallBack];
		}
	});
});

// Buscador errores en el JS y nos lo muestra por pantalla
gulp.task('jshint', function() {
	return gulp.src('./app/scripts/**/*.js')
		.pipe(jshint('.jshintrc.json'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

// Preprocesador de archivos Stylus a CSS y recarga de cambios
gulp.task('css', function() {
	gulp.src('./app/stylesheets/main.styl')
		.pipe(stylus({use: nib()}))
		.pipe(gulp.dest('./app/stylesheets'))
		.pipe(connect.reload());
});

// Recarga de navegador cuando hay cambios en el HTML
gulp.task('html', function() {
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

// Busqueda en carpetas style y js archivos nuevos para inyectarlos en index
gulp.task('inject', function() {
	var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css']);
	return gulp.src('index.html', {cwd: './app'})
		.pipe(inject(sources, {
			read: false,
			ignorePath: '/app'
		}))
		.pipe(gulp.dest('./app'));
});

// Inyectar librerias instaladas via bower
gulp.task('wiredep', function() {
	gulp.src('./app/index.html')
		.pipe(wiredep({
			directory: './app/lib'
		}))
		.pipe(gulp.dest('./app'));
});

// Vigilancia de cambios que se produzcan en el codigo
// Lanzamiento de tareas relacionadas
gulp.task('watch', function() {
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
	gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
	gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);