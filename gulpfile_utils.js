var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var colors = require('colors/safe');
var delFiles = require('del');
var delEmpty = require('delete-empty');
var minify = require('gulp-minify');

/**
 * copies the required angular files to the vendor dir after an angular update
 */
var minifyOptions = {
    ext:{
        src:'.js',
        min:'.min.js'
    },
    noSource: true,
    output: {
        comments: /license Angular/
    }
};
gulp.task('angular:node2vendor', function (done) {
        gulp.src('./node_modules/@angular/core/bundles/core.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/common/bundles/common-http.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/common/bundles/common.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/compiler/bundles/compiler.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/platform-browser/bundles/platform-browser.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/router/bundles/router.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/forms/bundles/forms.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/upgrade/bundles/upgrade.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/animations/bundles/animations.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/animations/bundles/animations-browser.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-bidi.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-coercion.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-collections.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-drag-drop.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-platform.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-portal.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-a11y.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/@angular/cdk/bundles/cdk-observers.umd.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/@angular'));
    gulp.src('./node_modules/tslib/tslib.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/tslib'));
    gulp.src('./node_modules/zone.js/dist/zone.min.js')
        .pipe(minify(minifyOptions))
        .pipe(gulp.dest('./vendor/zone.js/dist'));

    gulp.src('node_modules/rxjs/internal/**/*.js')
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red('[Error]' + err.toString()));
        })
        .pipe(gulp.dest('./vendor/rxjs/internal'));

    done(); //!important since gulp4
});

/**
 * copies the rxjs files required to vendor and minifies them
 */
gulp.task('angular:rxjs2vendor', function (done) {
    gulp.src('node_modules/rxjs/internal/**/*.js')
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red('[Error]' + err.toString()));
        })
        .pipe(gulp.dest('./vendor/rxjs/internal'));
    gulp.src('node_modules/rxjs/operators/**/*.js')
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red('[Error]' + err.toString()));
        })
        .pipe(gulp.dest('./vendor/rxjs/operators'));
    gulp.src('node_modules/rxjs/index.js')
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red('[Error]' + err.toString()));
        })
        .pipe(gulp.dest('./vendor/rxjs'));
    done(); //!important since gulp4
});

/**
 * copies the reflect file to vendor and minifies it
 */
gulp.task('angular:reflect2vendor', function (done) {
    gulp.src('node_modules/reflect-metadata/Reflect.js')
        .pipe(uglify())
        .on('error', function (err) {
            console.log(colors.red('[Error]' + err.toString()));
        })
        .pipe(gulp.dest('./vendor/reflect-metadata'));
    done(); //!important since gulp4
});

/**
 * removes vendor/rxjs contents
 */
gulp.task('js:clean_rxjs_ts', function (done) {
    delFiles([
        'vendor/rxjs/**/*.ts',
        'vendor/rxjs/**/*.js.map',
    ]);
    delEmpty.sync('src/');

    done(); //!important since gulp4
});

// compodoc -d ./compodoc -p tsconfig.compodoc.json
// typedoc --out ./documentation ./src --hideGenerator
// typedoc --out ./documentation ./src --hideGenerator -theme ./assets/typedoc/spicecrm --mode modules --name SpiceCRM --ignoreCompilerErrors

/**
 * generates typedoc documentation
 */
gulp.task("js:document", function() {

    var typedoc = require("gulp-typedoc");
    return gulp
        .src(["dist/**/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es5",
            includeDeclarations: true,

            // Output options (see typedoc docs)
            out: "./documentation",

            // TypeDoc options (see typedoc docs)
            name: "SpiceCRM",
            plugins: ["typedoc-plugin-external-module-name"],
            ignoreCompilerErrors: false,
            version: true,
            hideGenerator: true
        }));
});

gulp.task("css:slds", function(done) {
    gulp.src('sldassets/styles/*.css')
        .pipe(replace(/white;/gi, 'var(--color-white, white);'))
        .pipe(replace(/#eef4ff/gi, 'var(--color-grey-1, #eef4ff)'))
        .pipe(replace(/#f3f2f2/gi, 'var(--color-grey-3, #f3f2f2)'))
        .pipe(replace(/#706e6b/gi, 'var(--color-grey-9)'))
        .pipe(replace(/#080707/gi, 'var(--color-grey-13)'))
        .pipe(replace(/#b0c4df/gi, 'var(--brand-background-primary)'))
        .pipe(replace(/#1589ee/gi, 'var(--brand-primary, #1589ee)'))
        .pipe(replace(/#1b96ff/gi, 'var(--brand-primary, #1b96ff)'))
        .pipe(replace(/#0176d3/gi, 'var(--brand-primary, #0176d3)'))
        .pipe(replace(/#007add/gi, 'var(--brand-primary-active, #007add)'))
        .pipe(replace(/#0070d2/gi, 'var(--brand-accessible)'))
        .pipe(replace(/#005fb2/gi, 'var(--brand-accessible-active)'))
        .pipe(replace(/#005583/gi, 'var(--brand-header-contrast-cool)'))
        .pipe(replace(/#006dcc/gi, 'var(--brand-text-link)'))
        .pipe(replace(/(?<=[\s;](?:background|background-color)\s*:\s*)#061c3f/gi, 'var(--color-background-inverse)')) // keep the order! FIRST line for #061c3f
        .pipe(replace(/#061c3f/gi, 'var(--color-border-inverse)')) // keep the order! SECOND line for #061c3f (replaces what is left)
        .pipe(replace(/#4bca81/gi, 'var(--color-background-success)'))
        .pipe(replace(/#04844b/gi, 'var(--color-background-success-dark)'))
        .pipe(replace(/#00396b/gi, 'var(--color-text-link-active)'))
        .pipe(replace(/#5eb4ff/gi, 'var(--color-progressbar_item-completed)'))
        .pipe(replace(/rgba\(\s*21\s*,\s*137\s*,\s*238\s*,\s*0?.1\s*\)/gi, 'var(--brand-primary-transparent)'))
        .pipe(replace(/(?<=[\s;](?:background|background-color|border-color)\s*:\s*)#16325c/gi, 'var(--color-background-alt-inverse)'))
        .pipe(replace(/(?<=[\s;](?:box-shadow:[^;]*|border(?:-left|-right|-top|-bottom|-)color)\s*:\s*)#1589ee/gi, 'var(--color-border-brand)'))
        .pipe(gulp.dest('vendor/sldassets/styles/'));
    gulp.src('sldassets/icons/**/*')
        .pipe(gulp.dest('vendor/sldassets/icons'));
    gulp.src('sldassets/fonts/**/*')
        .pipe(gulp.dest('vendor/sldassets/fonts'));
    gulp.src('sldassets/images/**/*')
        .pipe(gulp.dest('vendor/sldassets/images'));
    done();
});

gulp.task("css:minify", function(done) {
    gulp.src('assets/css/spicecrm.css')
        .pipe(cleancss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('assets/css'));
    done();
});

gulp.task('angular:vendorminify', function (done) {
    gulp.src('vendor/@angular/*.js')
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            output: {
                comments: /license Angular/
            }
        }))
        .pipe(gulp.dest('vendor/@angular'));
    done();
});
