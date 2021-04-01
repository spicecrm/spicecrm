var through = require('through2');
var colors = require('colors/safe');
var PluginError = require('plugin-error');

var ProcessorEngine = require('./lib/ProcessorEngine');
var AngularProcessor = require('./lib/AngularProcessor');
var utils = require('./lib/utils');

const PLUGIN_NAME = 'gulp-spicecrm-embed-components';

module.exports = function (options) {
    options = options || {};

    var sourceType = options.sourceType;
    options.processors = [new AngularProcessor()];

    var logger = options.logger = utils.createLogger();
    if (options.debug !== true) {
        logger.debug = function () {}
    }
    delete options.debug;
    logger.warn = function(msg) {
        console.log(
            PLUGIN_NAME,
            colors.yellow('[Warning]'),
            colors.magenta(msg)
        );
    };

    var skipFiles = options.skipFiles || function() {return false;};
    delete options.skipFiles;
    if (typeof skipFiles === 'function') {
        /* OK */
    } else if (skipFiles instanceof RegExp) {
        var regexp = skipFiles;
        skipFiles = function(file) {
            return regexp.test(file.path);
        }
    } else {
        logger.warn('"skipFiles" options should be either function or regexp, actual type is ' + typeof skipFiles);
        skipFiles = function() {return false;}
    }

    var processorEngine = new ProcessorEngine();
    processorEngine.init(options);

    /**
     * This function is 'through' callback, so it has predefined arguments
     * @param {File} file file to analyse
     * @param {String} enc encoding (unused)
     * @param {Function} cb callback
     */
    function transform(file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            cb(null, file);
            return;
        }



        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streaming not supported. particular file: ' + file.path);
        }

        logger.debug('\n\nfile.path: %s', file.path || 'fake');

        if (skipFiles(file)) {
            logger.info('skip file %s', file.path);
            cb(null, file);
            return;
        }

        var pipe = this;
        processorEngine.process(file, cb, function onErr(msg) {
            pipe.emit('error', new PluginError(PLUGIN_NAME, msg));
        });
    }

    return through.obj(transform);
};