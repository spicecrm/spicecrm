(function(global) {
    System.config({
        paths: {
            "vendor:": "vendor/",
        },
        map: {
            app: "{{ app }}",
            '@angular/core': 'vendor:@angular/core.umd.min.js',
            '@angular/common': 'vendor:@angular/common.umd.min.js',
            '@angular/common/http': 'vendor:@angular/common-http.umd.min.js',
            '@angular/compiler': 'vendor:@angular/compiler.umd.min.js',
            '@angular/platform-browser': 'vendor:@angular/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'vendor:@angular/platform-browser-dynamic.umd.min.js',
            '@angular/platform-browser/animations': 'vendor:@angular/platform-browser-animations.umd.min.js',
            '@angular/animations': 'vendor:@angular/animations.umd.min.js',
            '@angular/animations/browser': 'vendor:@angular/animations-browser.umd.min.js',
            '@angular/router': 'vendor:@angular/router.umd.min.js',
            '@angular/forms': 'vendor:@angular/forms.umd.min.js',
            '@angular/upgrade': 'vendor:@angular/upgrade.umd.min.js',
            '@angular/cdk/drag-drop': 'vendor:@angular/cdk-drag-drop.umd.min.js',
            '@angular/cdk/coercion': 'vendor:@angular/cdk-coercion.umd.min.js',
            '@angular/cdk/platform': 'vendor:@angular/cdk-platform.umd.min.js',
            '@angular/cdk/scrolling': 'vendor:@angular/cdk-scrolling.umd.min.js',
            '@angular/cdk/bidi': 'vendor:@angular/cdk-bidi.umd.min.js',
            '@angular/cdk/collections': 'vendor:@angular/cdk-collections.umd.min.js',
            'socket.io-client': 'vendor:socket.io-client/dist/socket.io.js',
            'rxjs': 'vendor:rxjs',
            'rxjs/ajax': 'vendor:rxjs/ajax/index.js',
            'rxjs/internal-compatibility': 'vendor:rxjs/internal-compatibility/index.js',
            'rxjs/operators': 'vendor:rxjs/operators/index.js',
            'rxjs/testing': 'vendor:rxjs/testing/index.js',
            'rxjs/webSocket': 'vendor:rxjs/webSocket/index.js',
            'tslib': 'vendor:tslib/tslib.js',
            'google-auth-library': 'vendor:google-auth-library',
            'hammerjs': 'vendor:hammerjs/hammer.min.js',
        },
        packages: {
            app: {
                main: "./include/outlook/outlook",
                defaultExtension: "js?v={{ buildNumber }}",
            },
            rxjs: {
                main: "index.js",
                defaultExtension: "js",
            },
        },
    });
})(this);
