/**
 * @module SpiceUI
 */
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule, Title} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from 'environments/environment';
import {
    NgModule,
    Component,
    Renderer2,
    enableProdMode, ViewChild, ApplicationRef
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";

// spicecrm generic modules
import {SystemComponents} from "./systemcomponents/systemcomponents";
import {GlobalComponents} from "./globalcomponents/globalcomponents";
import {ObjectComponents} from "./objectcomponents/objectcomponents";

// various services we need on global app level
import {GlobalLogin} from "./globalcomponents/components/globallogin";
import {SystemDynamicRouteInterceptor} from "./systemcomponents/components/systemdynamicrouteinterceptor";
import {GlobalHeader} from "./globalcomponents/components/globalheader";
import {SpiceInstallerModule} from "./include/spiceinstaller/spiceinstallermodule";
import {loginCheck} from "./services/login.service";
import {ModuleTOTPAuthentication} from "./include/totpauthentication/moduletotpauthentication";

// declarations for TS
/**
 * @ignore
 */
declare var moment: any;
declare global {
    interface Date {
        format(format): string;
    }
}

moment.defaultFormat = "YYYY-MM-DD HH:mm:ss";

const bootstrap = (document.querySelector('meta[name="bootstrap"]') as HTMLMetaElement)?.content;

/**
 * the main component that gets bootstrapped withthe main module
 */
@Component({
    selector: "spicecrm",
    template: "<global-header></global-header><div [ngStyle]='outletstyle'><router-outlet></router-outlet><system-navigation-manager></system-navigation-manager></div><global-footer></global-footer>"
})
export class SpiceUI {
    /**
     * reference to the module menu item
     */
    @ViewChild(GlobalHeader) public globalHeader: GlobalHeader;

    constructor(public render: Renderer2) {
        // stop just dropping files on the app
        this.render.listen('window', 'dragover', e => {
            e.preventDefault();
            e.dataTransfer.effectAllowed = "none";
            e.dataTransfer.dropEffect = "none";
        });
        this.render.listen('window', 'drop', e => {
            e.preventDefault();
        });
    }

    /**
     * sets the top margin the headers that is set static requires
     */
    get outletstyle() {
        const headerHeight = (this.globalHeader ? this.globalHeader.headerHeight : 0);
        return {
            'margin-top': headerHeight + 'px',
            'height': `calc(100vh - ${headerHeight}px)`
        };
    }
}

/**
 * the main module
 */
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        ModuleTOTPAuthentication,
        SpiceInstallerModule,
        RouterModule.forRoot(
            [
                {path: "login", component: GlobalLogin},
                {path: "", redirectTo: "/module/Home", pathMatch: "full"},
                {path: '**', component: SystemDynamicRouteInterceptor, canActivate: [loginCheck]}
            ]
        )
    ],
    declarations: [SpiceUI],
    providers: [

        {provide: LocationStrategy, useClass: HashLocationStrategy},
        Title,
    ]
})
export class SpiceUIModule {

    public ngDoBootstrap(appRef: ApplicationRef) {

        let bootstrapComponent: unknown = SpiceUI;

        appRef.bootstrap(bootstrapComponent as any);
    }
}

/**
 * sets the prod mode. this reduces angular unnecessary checks in prod mode
 */
if (environment.production) {
    enableProdMode();
    console.log('production mode enabled');
}

/**
 * browser detection .. IE is not supported
 */
declare global {
    interface Document {
        documentMode?: any;
    }
}
if (/*@cc_on!@*/false || !!document.documentMode) {
    document.getElementsByClassName("loaderspinner")[0].setAttribute('style', 'display:none');
    document.getElementById('loadstatus').innerHTML = '';
    document.getElementById('loadermessage').innerHTML = 'Internet Explorer is not supported. Please use a supported Browser like Chrome, Safari, Edge, etc.';
} else {
    document.getElementById('loadstatus').innerHTML = '...preparing..';
    // ToDo: Prep for Angular 9 - ZoneEventCoalsecing - to be tried for reduced change detection cycles
    // platformBrowserDynamic().bootstrapModule(SpiceUIModule, { ngZoneEventCoalescing: true });

    if (bootstrap == 'outlook') {
        window['Office'].onReady().then(() => {
            platformBrowserDynamic().bootstrapModule(SpiceUIModule).catch(error => console.error(error));
        });
    } else {
        platformBrowserDynamic().bootstrapModule(SpiceUIModule).catch(error => console.error(error));
    }
}

/**
 * a handler for using an existing window if a link is clicked e.g. in an email so SpiceCRM is not started for a second time but the existing one navigates properly to the requested ressource
 */
window.name = 'SpiceCRM';
(() => {
    if (window.hasOwnProperty('BroadcastChannel')) { // Does the browser know the Broadcast API?
        let bc = new BroadcastChannel('spiceCRM_channel');
        bc.onmessage = e => {
            if (e.data.url && e.data.url.startsWith(window.location.origin + window.location.pathname)) {
                window.location = e.data.url;
                bc.postMessage({urlReceived: true});
            }
        };
    }
})();
