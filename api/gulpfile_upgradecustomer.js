/**
 * When customer uses independent repository, copy files from spicecrm factory to customer's repository is necessary
 * This gulp file is designed to help copy files from local factory branch to local customer's folder
 * Destination is prompted
 * Copy core only or core + custom is prompted
 * Some folders are cleaned (to make sure deleted files are deleted in customer's folder)
 * Files are copied to destination
 * File headers are generated during copy task
 * JOB to call: spicecrm:upgradecustomer
 */

require('./gulpfile_globals.js');
var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var fs = require('fs');
var del = require("del");
var prompt = require('gulp-prompt');

////////////// Upgrade spicemore backend in customer's repository  //////////////
global.spiceupgradedestination = '../brk/api'; //destination folder example: ../br_spicecrm_be
gulp.task('spicecrm:upgradeprompt', function() {
    return gulp.src('gulpfile_release.js')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'destination',
            message: 'Please, enter relative path to destination (example ../br_spicecrm_be):'
        }, {
            type: 'input',
            name: 'updatecustom',
            message: 'Update custom too? (y/n)'
        }
        ], function(result) {

            // Enforce only one selection.
            if (result.destination.length < 5) {
                console.log('Looks like path is too short... aborting.');
                exit(1);
            }

            // grab updatecustom
            _doUpgradeCustom = false;
            if(result.updatecustom == 'y'){
                _doUpgradeCustom = true;
            }

            //grab input
            spiceupgradedestination = result.destination;

            //check if destination exists
            fs.exists(spiceupgradedestination, (exists) => {
                if(exists){
                    _cleanJobs = ['spicecrm:cleancustomercore'];
                    _copyJobs = ['spicecrm:upgradecopyfilescore'];

                    if(_doUpgradeCustom){
                       _cleanJobs = ['spicecrm:cleancustomercore', 'spicecrm:cleancustomercustom'];
                       _copyJobs = ['spicecrm:upgradecopyfilescore', 'spicecrm:upgradecopyfilescustom'];
                    }

                    (gulp.series( gulp.parallel(_cleanJobs), gulp.parallel(_copyJobs), function(done) {
                        console.log('Done: cleaned core, copied core. Waiting for exit code...');
                        done();
                    })());
                }
                else{
                    console.log('error: destination ' + spiceupgradedestination + ' does not exist');
                }
            });

        }));
});
gulp.task('spicecrm:cleancustomercore', function (done) {
    console.log('cleaning core files...');
    var source = [
         spiceupgradedestination + '/data/**/*'
        ,spiceupgradedestination + '/include/**/*'
        ,spiceupgradedestination + '/KREST/**/*'
        ,spiceupgradedestination + '/language/**/*'
        ,spiceupgradedestination + '/metadata/**/*'
        ,spiceupgradedestination + '/modules/**/*'
        ,spiceupgradedestination + '/service/**/*'
        ,spiceupgradedestination + '/soap/**/*'
        ,spiceupgradedestination + '/vendor/**/*',
    ];
    return del(source, {force: true});
});
gulp.task('spicecrm:cleancustomercustom', function (done) {
    console.log('cleaning custom files...');
    var source = [
        spiceupgradedestination + '/custom/**/*'
    ];
    return del(source, {force: true});
});
gulp.task('spicecrm:upgradecopyfilescore', function(done) {
    console.log('copying core files to ' + spiceupgradedestination + ' ...');
    var spicesrc = [
        'data/**/*',
        'include/**/*',
        'KREST/**/*',
        'metadata/**/*',
        'modules/**/*',
        'service/**/*',
        'soap/**/*',
        'vendor/**/*',
        '.htaccess',
        '*.php',
        '*.gitignore',
        '*.htaccess',
        'LICENSE',
        'LICENSE.txt',
        'sugar_version.php',
        '!package.json',
        '!config.php',
        '!config_override.php'
    ];

    gulp.src(spicesrc, {base: './'})
        .pipe(replace(spiceSugarHeaderPattern, spiceSugarHeader))
        .pipe(replace(spiceHeaderPattern, spiceHeader))
        .pipe(gulp.dest(spiceupgradedestination));

    done(); //!important since gulp4

});
gulp.task('spicecrm:upgradecopyfilescustom', function(done) {
    console.log('copying custom files to ' + spiceupgradedestination + ' ...');
    var spicesrc = ['custom/**/*', '!custom/application', '!custom/application/**/*'];

    gulp.src(spicesrc, {base: './'})
        .pipe(replace(spiceSugarHeaderPattern, spiceSugarHeader))
        .pipe(replace(spiceHeaderPattern, spiceHeader))
        .pipe(gulp.dest(spiceupgradedestination));

    done(); //!important since gulp4
});

// gulp task to call
gulp.task('spicecrm:upgradecustomer', gulp.series('spicecrm:upgradeprompt'), function(done){
    console.log('Job completed. Please, check if any file shall be added to repository');
    done();
});
