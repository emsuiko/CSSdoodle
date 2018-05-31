var gulp = require('gulp');
var log = require('fancy-log');
var beeper = require('beeper');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var del = require('del');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

var randomize = require('randomatic');

var env = require('minimist')(process.argv.slice(2))._[0] || 'development';

var isDevelopment = function() {
    return (env === 'development');
};
var isProduction = function () {
    return !isDevelopment();
};

var sassFilter = function(file) {
    return !/\/_/.test(file.path) || !/^_/.test(file.relative);
};

function onError(err) {
    beeper();
    log.error(err);
}

// * * * * * FUNCTIONS * * * * * //
function sass(filestream) {
    return filestream
        .pipe($.sassInheritance({ dir: 'src/sass/' }))
        .pipe($.filter(sassFilter))
        .pipe($.if(isDevelopment(), $.sourcemaps.init()))
        .pipe($.sass())
        .pipe($.if(isProduction(), $.postcss([
            autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] }),
            cssnano()
        ]), $.postcss([
            autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] })
        ])))
        .pipe($.if(isDevelopment(), $.sourcemaps.write()))
        .pipe(gulp.dest('dist'))
        .pipe($.if(isDevelopment(),browserSync.stream()));
}

function templates(filestream) {
    return filestream
        .pipe($.pug())
        .pipe(gulp.dest('dist'))
        .pipe($.if(isDevelopment(),browserSync.stream()));
}

function newTileSass(name) {
    var str = 'div.'+name;
    return $.file(name+'.sass', str, { src: true }).pipe(gulp.dest('src/sass/tiles')) &&
        gulp
            .src('src/sass/styles.sass')
            .pipe($.modifyFile((content, path, file) => {
                const add = '\n@import tiles/'+name;

                return `${content}${add}`;
            }))
            .pipe(gulp.dest('src/sass'));
}

function newTilePug(name) {
    var str = 'div.'+name;
    return $.file(name+'.pug', str, { src: true }).pipe(gulp.dest('src/pug/tiles')) &&
        gulp
            .src('src/pug/index.pug')
            .pipe($.modifyFile((content, path, file) => {
                const add = '\n    include tiles/'+name;

                return `${content}${add}`;
            }))
            .pipe(gulp.dest('src/pug'));
}

// * * * * * TASKS * * * * * //

gulp.task('templates', function() {
    return templates(gulp.src('src/pug/index.pug'));
});

gulp.task('sass', function() {
    return sass(gulp.src('src/sass/**/*.sass'));
});

gulp.task('clean', function() {
    log('Clean processed output.')
    return del([
        'index.html',
        'styles.css',
    ]);
});

gulp.task('build', ['templates', 'sass']);

gulp.task('watch', ['templates', 'sass', 'browserSync'], function() {
    log('Start watching...');

    watch('src/pug/**/*.pug', { verbose: true }, function(vinyl) {
        var filename = vinyl.path.replace(vinyl.cwd + '/', '');
        templates(gulp.src('src/pug/index.pug')
                .pipe(plumber({ errorHandler: onError })),'')
            .on('end', function() {
                log('...re-pugged '+filename);
                browserSync.reload;
            });
    });

    watch('src/sass/**/*.sass', { verbose: true }, function(vinyl) {
        var filename = vinyl.path.replace(vinyl.cwd + '/', '');
        sass(gulp.src([filename], { base: 'src/sass/' })
                .pipe(plumber({ errorHandler: onError })))
            .on('end', function() {
                log('...re-sassed '+filename);
                browserSync.reload;
            });
    });
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('tile', function() {
    var name = randomize('Aa0', 10);
    newTilePug(name);
    newTileSass(name);
    log('Congratulations! You just created a new tile for doodling: '+name);
});

gulp.task('screens', function () {
  gulp.src('index.html')
  .pipe($.localScreenshots({
    width: ['1600']
   }))
  .pipe(gulp.dest('.'));
});

gulp.task('default', ['clean'], function() {
    log('Start build for ' + env);
    gulp.start('watch');
});
