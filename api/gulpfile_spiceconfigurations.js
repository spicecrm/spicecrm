/**
 * This file generates the content for folder ./spiceconfigurations
 * This folder contains basic configurations necessary for an offline installation of SpiceCRM
 *
 * Implemented logic:
 * set release number & any system value manually in gulpfile_globals.js
 * run task "spiceconfigurations:generate"
 * -> clean folder ./spiceconfigurations
 * -> get necessary configuration for installation
 * -> get languages en_us, de_DE from spicereference and pack results to a file
 * -> get package bundle and save to file (A package bundle represents a list of packages bundled under a name)
 * -> merge system variables
 *
 * @type {*|Gulp}
 */

require('../gulpfile_globals.js');

var gulp = require('gulp');
var request = require('request');
var fs = require('fs');
var del = require("del");

/**
 * get a language package and create a file with its content
 * @param done
 * @param language
 */
var getLanguage = function (done, language) {
    request(global.reference + '/configuration/syslanguages/language/' + language, function (error, response, body) {
        fs.writeFile(global.spiceconfigurations.folder + '/' + language + '.txt', body, done);
        console.log(global.spiceconfigurations.folder + '/' + language + '.txt');
    });
};

/**
 * get a bundle of packages and create a file with its content
 * @param done
 * @param bundle
 * @param configurations
 */
var getBundle = function (done, bundle, configurations) {
    request(global.reference + '/config/' + configurations.packages[bundle] + '/*', function (error, response, body) {
        fs.writeFile(global.spiceconfigurations.folder + '/' + bundle + '.txt', body, done);
        console.log(global.spiceconfigurations.folder + '/' + bundle + '.txt');
    });
};

/**
 * get contents and create ./spiceconfigurations/spiceconfigurations.json
 * @param done
 * @param bundle
 * @param configurations
 */
var createSpiceConfigurationsJsonFile = function (done, loadedConf) {
    // enrich loadedConf with system requirements
    loadedConf.system = global.spiceconfigurations.system;

    // add build number
    loadedConf.build = global.build;
    loadedConf.build.buildnumber  = loadedConf.build.releasenumber + '.' + Date.now();

    // write the file
    fs.writeFile(global.spiceconfigurations.folder + '/' + global.spiceconfigurations.filename, JSON.stringify(loadedConf, null,4), done);
};


/**
 * the task to run to create contents in folder /spiceconfigurations
 */
gulp.task('spiceconfigurations:subtask:load', function (done) {
    // send request to get configurations
    request(global.reference + '/systemdeploymentpackages/install', function (error, response, body) {
        var configurations = JSON.parse(body);
        console.log(configurations);

        // store
        var storeConfigurationsForjson = { packages: {}, languages: {}, build: {}, system: {}};

        // packages
        for (var bundle in configurations.packages){
            getBundle(done, bundle, configurations);
            storeConfigurationsForjson.packages[bundle] = bundle +'.txt';
        }
        // languages
        for (var language of configurations.languages){
            getLanguage(done, language);
            storeConfigurationsForjson.languages[language] = language +'.txt';
        }

        // the json file
        createSpiceConfigurationsJsonFile(done, storeConfigurationsForjson);

    })

    done(); //!important since gulp4
});

// Task to delete target build folder
gulp.task('spiceconfigurations:subtask:clean', function() {
    return del(['spiceconfigurations/**', '!spiceconfigurations']);
});

// the main task to run
gulp.task('spiceconfigurations:generate', gulp.series(
        'spiceconfigurations:subtask:clean',
        'spiceconfigurations:subtask:load'), function(done){
    done();
});