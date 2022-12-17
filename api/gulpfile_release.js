/**
 * copy files for core release
 * Should contain frontend CORE and backend CORE under (/api) folder
 *
 * @type {*|Gulp}
 */

require('./gulpfile_globals.js');

var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var header = require('gulp-header');
var del = require("del");
var moment = require('moment');
var prompt = require('gulp-prompt');
var fs = require('fs');

///////////// PROMPTS TO GET source & target FOLDERS//////////////
gulp.task('release:prompts', function (done) {
    return gulp.src('gulpfile_globals.js')
            .pipe(
                    prompt.prompt([{
                        type: 'list',
                        name: 'releaseType',
                        message: 'Please, select proper release type (all in one | separated):',
                        choices: ['allinone', 'separated']
                    }, {
                        type: 'list',
                        name: 'releaseBundle',
                        message: 'Please, select proper release bundle (core | more):',
                        choices: ['core', 'more']
                    }, {
                        type: 'input',
                        name: 'sourceFE',
                        message: 'Please, enter relative path to frontend source (example ../spicecrm_fe_factory):'
                    }, {
                        type: 'input',
                        name: 'targetFE',
                        message: 'Please, enter relative path to target frontend folder (example ../spicecrm):'
                    }, {
                        type: 'input',
                        name: 'targetBE',
                        message: 'Please, enter relative path to target backend folder (example ../spicecrm/api) - leave empty for /api:'
                    }], function (result) {
                        if (result.releaseType == 'allinone' || !result.targetBE || result.targetBE === '') {
                            result.targetBE = result.targetFE + '/api'
                        }
                        global.releaseSettings = result;

                        // console.log(global.releaseSettings);
                    })
            );
    done();
});

///////////// CLEAN TARGET FOLDERS //////////////
gulp.task('release:clean:fe', function (done) {
    // console.log(global.releaseSettings.targetFE + '/**/*');
    if (fs.existsSync(global.releaseSettings.targetFE)) {
        console.log(global.releaseSettings);

        var source = [global.releaseSettings.targetFE + '/**/*',
            '!' + global.releaseSettings.targetFE + '/node_modules',
            global.releaseSettings.targetFE + '/.gitignore',
            global.releaseSettings.targetFE + '/.htaccess',
            global.releaseSettings.targetFE + '/*.log'];
        return del(source, {force: true});
    }
    done();
});
gulp.task('release:clean:be', function (done) {
    // console.log(global.releaseSettings.targetBE + '/**/*');
    if (fs.existsSync(global.releaseSettings.targetBE)) {
        var source = [global.releaseSettings.targetBE + '/**/*',
            global.releaseSettings.targetBE + '/.gitignore',
            global.releaseSettings.targetBE + '/.htaccess',
            global.releaseSettings.targetBE + '/*.log'];
        return del(source, {force: true});
    }
    done();
});

///////////// FILL TARGET FOLDERS //////////////
gulp.task('release:fe', function (done) {
    require(global.releaseSettings.sourceFE + '/gulpfile_globals.js');

    gulp.src([global.releaseSettings.sourceFE + '/index.html',
                global.releaseSettings.sourceFE + '/opener.html',
                global.releaseSettings.sourceFE + '/systemjs.config.js',
                global.releaseSettings.sourceFE + '/copyright.html',
                global.releaseSettings.sourceFE + '/.gitignore',
                global.releaseSettings.sourceFE + '/package.json',
                global.releaseSettings.sourceFE + '/gulpfile.js',
                global.releaseSettings.sourceFE + '/gulpfile_globals.js',
                global.releaseSettings.sourceFE + '/tsconfig.json'
            ],
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/assets/**/*.*',
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/gulp-plugins/**/*.*',
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/sldassets/**/*.*',
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/vendor/**/*.*',
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/proxy/**/*.*', {base: global.releaseSettings.sourceFE, dot: true})
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/config/*.*', {base: global.releaseSettings.sourceFE, dot: true})
            .pipe(gulp.dest(global.releaseSettings.targetFE));

    var srcSource = [global.releaseSettings.sourceFE + '/src/**/*.ts', global.releaseSettings.sourceFE + '/src/**/**/*.ts'];
    if (global.releaseSettings.releaseBundle == 'core') {
        var srcExclusion = [];
        global.releasePathsFE.excludeSrcCoreFE.forEach(path => {
            var newPath = path.replace('!./src/', '!' + global.releaseSettings.sourceFE + '/src/');
            srcExclusion.push(newPath);
        });
        srcSource = srcSource.concat(srcExclusion);
    }
    gulp.src(srcSource, {base: global.releaseSettings.sourceFE})
            .pipe(header('/*\r\n' + fs.readFileSync(global.releaseSettings.sourceFE + '/license/core/license.txt') + '\r\n*/\r\n\r\n'))
            .pipe(gulp.dest(global.releaseSettings.targetFE));

    srcSource = [global.releaseSettings.sourceFE + '/src/**/*.html'];
    if (global.releaseSettings.releaseBundle == 'core') {
        srcExclusion = [];
        global.releasePathsFE.excludeSrcCoreFE.forEach(path => {
            var newPath = path.replace('!./src/', '!' + global.releaseSettings.sourceFE + '/src/');
            srcExclusion.push(newPath);
        });
        srcSource = srcSource.concat(srcExclusion);
    }
    gulp.src(srcSource, {base: global.releaseSettings.sourceFE})
            .pipe(header('<!--\r\n' + fs.readFileSync(global.releaseSettings.sourceFE + '/license/core/license.txt') + '\r\n-->\r\n\r\n'))
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/src/services/buildheader.file',
            {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));

    var appSource = [global.releaseSettings.sourceFE + '/app/**/*.js'];
    if (global.releaseSettings.releaseBundle == 'core') {
        var appExclusion = [];
        global.releasePathsFE.excludeAppCoreFE.forEach(path => {
            var newPath = path.replace('!./app/', '!' + global.releaseSettings.sourceFE + '/app/');
            appExclusion.push(newPath);
        });
        appSource = appSource.concat(appExclusion);
    }
    gulp.src(appSource, {base: global.releaseSettings.sourceFE})
            .pipe(header('/*\r\n' + fs.readFileSync(global.releaseSettings.sourceFE + '/license/core/license.txt') + '\r\n*/\r\n\r\n'))
            .pipe(gulp.dest(global.releaseSettings.targetFE));
    gulp.src(global.releaseSettings.sourceFE + '/license/core/license.txt', {base: global.releaseSettings.sourceFE})
            .pipe(gulp.dest(global.releaseSettings.targetFE));

    done(); //!important since gulp 4
});

gulp.task('release:be', function (done) {
    // paths and create when missing
    if (!fs.existsSync(global.releaseSettings.targetFE)) {
        gulp.dest(global.releaseSettings.targetFE);
    }
    if (!fs.existsSync(global.releaseSettings.targetBE)) {
        gulp.dest(global.releaseSettings.targetBE);
    }

    var source = [];
    source = source.concat(global.releasePaths.includeFilesCommonBE);
    source = source.concat(global.releasePaths.excludeFilesCommonBE);

    if (global.releaseSettings.releaseBundle == 'core') {
        source = source.concat(global.releasePaths.excludeFilesCoreBE);
        source = source.concat(global.releasePaths.kreporterCoreBE);
    } else {
        source = source.concat(global.releasePaths.kreporterMoreBE);
    }
    return gulp.src(source, {base: './'})
            .pipe(replace(global.spiceSugarHeaderPattern, spiceSugarHeader))
            .pipe(replace(global.spiceHeaderPattern, spiceHeader))
            .pipe(gulp.dest(global.releaseSettings.targetBE));
    done();
});


// main task to run
gulp.task('release:spicecrm', gulp.series('release:prompts', 'release:clean:fe', 'release:clean:be', 'release:fe', 'release:be'), function (done) {
    done();
});
