(function (global) {
    System.config({
        paths: {
            'vendor:': 'vendor/'
        },
        map: {
            app: 'app',
            '@angular/core': 'vendor:@angular/core.umd.min.js',
            '@angular/common': 'vendor:@angular/common.umd.min.js',
            '@angular/common/http': 'vendor:@angular/common-http.umd.min.js',
            '@angular/compiler': 'vendor:@angular/compiler.umd.min.js',
            '@angular/platform-browser': 'vendor:@angular/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'vendor:@angular/platform-browser-dynamic.umd.min.js',
            '@angular/router': 'vendor:@angular/router.umd.min.js',
            '@angular/forms': 'vendor:@angular/forms.umd.min.js',
            // '@angular/upgrade': 'vendor:@angular/upgrade/bundles/upgrade.umd.min.js',
            'socket.io-client': 'vendor:socket.io-client/dist/socket.io.js',
            'rxjs': 'vendor:rxjs',
            'rxjs/ajax': 'vendor:rxjs/ajax/index.js',
            'rxjs/internal-compatibility': 'vendor:rxjs/internal-compatibility/index.js',
            'rxjs/operators': 'vendor:rxjs/operators/index.js',
            'rxjs/testing': 'vendor:rxjs/testing/index.js',
            'rxjs/webSocket': 'vendor:rxjs/webSocket/index.js',
            'tslib': 'vendor:tslib/tslib.js',
            'google-auth-library': 'vendor:google-auth-library'
        },
        packages: {
            app: {
                main: './outlook/outlook',
                defaultExtension: 'js'
            },
            rxjs: {
                main: "index.js",
                defaultExtension: 'js'
            }
        }
    });
})(this);
