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
    enableProdMode, ViewChild
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
import {loggerService} from './services/logger.service';
import {configurationService} from "./services/configuration.service";
import {helper} from "./services/helper.service";
import {loginService, loginCheck} from "./services/login.service";
import {subscription} from "./services/subscription.service";
import {notification} from "./services/notification.service";
import {session} from "./services/session.service";
import {metadata, aclCheck, noBack} from "./services/metadata.service";
import {MathExpressionCompilerService} from "./services/mathexpressioncompiler";
import {language} from "./services/language.service";
import {recent} from "./services/recent.service";
import {userpreferences} from "./services/userpreferences.service";
import {fts} from "./services/fts.service";
import {loader} from "./services/loader.service";
import {broadcast} from "./services/broadcast.service";
import {dockedComposer} from "./services/dockedcomposer.service";
import {backend} from "./services/backend.service";
import {navigation,canNavigateAway} from "./services/navigation.service";
import {modelutilities} from "./services/modelutilities.service";
import {toast} from "./services/toast.service";
import {favorite} from "./services/favorite.service";
import {reminder} from "./services/reminder.service";
import {territories} from "./services/territories.service";
import {currency} from "./services/currency.service";
import {footer} from "./services/footer.service";
import {assistant} from "./services/assistant.service";
import {modal} from "./services/modal.service";
import {layout} from "./services/layout.service";
import {libloader} from "./services/libloader.service";
import {telephony} from "./services/telephony.service";
import {socket} from "./services/socket.service";
import {SystemInstallerComponent} from "./systemcomponents/components/systeminstallercomponent";
import {GlobalLogin} from "./globalcomponents/components/globallogin";
import {SystemDynamicRouteInterceptor} from "./systemcomponents/components/systemdynamicrouteinterceptor";
import {GlobalHeader} from "./globalcomponents/components/globalheader";
import {activitiytimeline} from "./services/activitiytimeline.service";
import {googleapiloader} from "./services/apiloader";
import {mediafiles} from "./services/mediafiles.service";

// declarations for TS
/**
 * @ignore
 */
declare var System: any;
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
        return {
            'margin-top': (this.globalHeader ? this.globalHeader.headerHeight : 0) + 'px'
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
        RouterModule.forRoot(
            [
                {path: "install", component: SystemInstallerComponent},
                {path: "login", component: GlobalLogin},
                {path: "", redirectTo: "/module/Home", pathMatch: "full"},
                {path: '**', component: SystemDynamicRouteInterceptor, canActivate: [loginCheck]},
                // {path: '**', redirectTo: 'module/Home'/*, canActivate: [loginCheck]*/}
            ]
        )
    ],
    declarations: [SpiceUI],
    bootstrap: [SpiceUI],
    providers: [
        aclCheck,
        assistant,
        backend,
        broadcast,
        canNavigateAway,
        configurationService,
        currency,
        dockedComposer,
        favorite,
        footer,
        fts,
        helper,
        language,
        layout,
        libloader,
        loader,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        loggerService,
        loginCheck,
        loginService,
        MathExpressionCompilerService,
        metadata,
        modal,
        modelutilities,
        noBack,
        navigation,
        recent,
        reminder,
        session,
        socket,
        telephony,
        territories,
        Title,
        loggerService,
        libloader,
        toast,
        userpreferences,
        notification,
        subscription
    ]
})
export class SpiceUIModule {
    constructor(
        public socket: socket,
        public assistant: assistant,
        public reminder: reminder
    ) {

    }
}

/**
 * sets the prod mode. THis is enabled in the build workflow for production build
 */
// enableProdMode();

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
    platformBrowserDynamic().bootstrapModule(SpiceUIModule);
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
