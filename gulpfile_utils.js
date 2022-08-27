var gulp = require('gulp');
var replace = require('gulp-replace');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');

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