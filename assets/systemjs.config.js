(function (global) {
    System.config({
        paths: {
            'vendor:': 'vendor/'
        },
        map: {
            app: '{{ app }}',
            '@angular/core': 'vendor:@angular/core.umd.min.js?v=11.2.4',
            '@angular/common': 'vendor:@angular/common.umd.min.js?v=11.2.4',
            '@angular/common/http': 'vendor:@angular/common-http.umd.min.js?v=11.2.4',
            '@angular/compiler': 'vendor:@angular/compiler.umd.min.js?v=11.2.4',
            '@angular/platform-browser': 'vendor:@angular/platform-browser.umd.min.js?v=11.2.4',
            '@angular/platform-browser-dynamic': 'vendor:@angular/platform-browser-dynamic.umd.min.js?v=11.2.4',
            '@angular/platform-browser/animations': 'vendor:@angular/platform-browser-animations.umd.min.js?v=11.2.4',
            '@angular/animations': 'vendor:@angular/animations.umd.min.js?v=11.2.4',
            '@angular/animations/browser': 'vendor:@angular/animations-browser.umd.min.js?v=11.2.4',
            '@angular/router': 'vendor:@angular/router.umd.min.js?v=11.2.4',
            '@angular/forms': 'vendor:@angular/forms.umd.min.js?v=11.2.4',
            '@angular/upgrade': 'vendor:@angular/upgrade.umd.min.js?v=11.2.4',
            '@angular/cdk/drag-drop': 'vendor:@angular/cdk-drag-drop.umd.min.js?v=11.2.3',
            '@angular/cdk/coercion': 'vendor:@angular/cdk-coercion.umd.min.js?v=11.2.3',
            '@angular/cdk/platform': 'vendor:@angular/cdk-platform.umd.min.js?v=11.2.3',
            '@angular/cdk/scrolling': 'vendor:@angular/cdk-scrolling.umd.min.js?v=11.2.3',
            '@angular/cdk/bidi': 'vendor:@angular/cdk-bidi.umd.min.js?v=11.2.3',
            '@angular/cdk/collections': 'vendor:@angular/cdk-collections.umd.min.js?v=11.2.3',
            '@angular/cdk/portal': 'vendor:@angular/cdk-portal.umd.min.js?v=11.2.3',
            'socket.io-client': 'vendor:socket.io-client/dist/socket.io.js',
            'rxjs': 'vendor:rxjs',
            'rxjs/operators': 'vendor:rxjs/operators/index',
            'tslib': 'vendor:tslib/tslib.js',
            'google-auth-library': 'vendor:google-auth-library',
            'hammerjs': 'vendor:hammerjs/hammer.min.js',
            'ts-md5': 'vendor:ts-md5/md5.js',
        },
        packages: {
            'app': {
                main: './spiceui',
                defaultExtension: 'js?v={{ buildNumber }}'
            },
            rxjs: {
                main: "index",
                defaultExtension: 'js?v=6.6.3'
            }
        }
    });
})(this);
