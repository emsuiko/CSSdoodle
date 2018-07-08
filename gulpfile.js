var gulp = require('gulp');
var log = require('fancy-log');
var beeper = require('beeper');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var del = require('del');

var randomize = require('randomatic');

var fs = require('fs');
var path = require('path');

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

function imagine(file) {
    return gulp.src([file])
        .pipe(gulp.dest('dist/img'));
}

function newTileSass(name) {
    var str = 'div.'+name;
    return $.file('_'+name+'.sass', str, { src: true }).pipe(gulp.dest('src/sass/tiles')) &&
        gulp
            .src('src/sass/styles.sass')
            .pipe($.modifyFile((content, path, file) => {
                const add = '\n@import tiles/_'+name;

                return `${content}${add}`;
            }))
            .pipe(gulp.dest('src/sass'));
}

function newTilePug(name) {
    var str = 'div.'+name;
    return $.file('_'+name+'.pug', str, { src: true }).pipe(gulp.dest('src/pug/tiles')) &&
        gulp
            .src('src/pug/index.pug')
            .pipe($.modifyFile((content, path, file) => {
                const add = '\n            include tiles/_'+name;

                return `${content}${add}`;
            }))
            .pipe(gulp.dest('src/pug'));
}

// source: https://stackoverflow.com/questions/15696218/get-the-most-recent-file-in-a-directory-node-js
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    var _ = require('underscore');
    
    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    }).slice(1, -4);
}

function takeScreenshot(filename) {
    return gulp.src('./dist/index.html')
        .pipe($.webshot({
                    dest:'./src/img',
                    root:'./dist',
                    screenSize: { width: 1600, height: 1000 },
                    shotSize: {width: 1600, height: 1000 },
                    filename: filename
                })
        );
}

function createThumbnail(filename) {
    return gulp.src('src/img/'+filename+'.png')
            .pipe($.imageResize({
              width : 200,
              height : 125,
              crop : true,
              upscale : false
            }))
            .pipe(gulp.dest('src/img/thumb'));
}

// * * * * * TASKS * * * * * //

gulp.task('templates', function() {
    return templates(gulp.src(['src/pug/*.pug', '!src/pug/_*.pug']));
});

gulp.task('sass', function() {
    return sass(gulp.src('src/sass/styles.sass'));
});

gulp.task('img', function() {
    return imagine('src/img/**/*');
});

gulp.task('clean', function() {
    log('Clean processed output.')
    return del([
        'dist/*.html',
        'dist/*.css',
        'dist/img/**/*',
        '!dist/img/.gitkeep',
    ]);
});

gulp.task('build', ['templates', 'sass', 'img']);

gulp.task('watch', ['templates', 'sass', 'img', 'browserSync'], function() {
    log('Start watching...');

    $.watch('src/pug/**/*.pug', { verbose: true }, function(vinyl) {
        templates(gulp.src(['src/pug/*.pug', '!src/pug/_*.pug'])
                .pipe($.plumber({ errorHandler: onError })),'');
    });

    $.watch('src/sass/**/*.sass', { verbose: true }, function(vinyl) {
        var filename = vinyl.path.replace(vinyl.cwd + '/', '');
        sass(gulp.src([filename], { base: 'src/sass/' })
                .pipe($.plumber({ errorHandler: onError })));
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
    var name = randomize('Aa', 10);
    newTilePug(name);
    newTileSass(name);
    log('Congratulations! You just created a new tile for doodling: '+name);
});

gulp.task('screenshot', ['build'], () => {
    var filename = getMostRecentFileName("src/pug/tiles");
    log('Creating screenshot for tile: '+filename);
    takeScreenshot(filename);
});

gulp.task('thumbnail', () => {
    var filename = getMostRecentFileName("src/pug/tiles");
    log('Creating thumbnail for tile: '+filename);
    createThumbnail(filename);
});

gulp.task('history', function(){
    var name = require('minimist')(process.argv)['name'];
    var filename = getMostRecentFileName("src/pug/tiles");
    log('Creating history entry for user '+name+' with tile '+filename);
    return gulp.src(['src/pug/history/_blank.pug'])
        .pipe($.rename('_'+filename+'.pug'))
        .pipe($.replace('filename', filename))
        .pipe($.replace('tilecounter', filename))
        .pipe($.replace('yournamehere', name))
        .pipe(gulp.dest('src/pug/history/'))
        && gulp.src('src/pug/history.pug')
        .pipe($.modifyFile((content, path, file) => {
            const add = '\n                include history/_'+filename;

            return `${content}${add}`;
        }))
        .pipe(gulp.dest('src/pug'));
  });

gulp.task('default', ['clean'], function() {
    log('Start build for ' + env);
    gulp.start('watch');
});
