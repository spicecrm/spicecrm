import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
    SystemJsNgModuleLoader
} from '@angular/core';
import {NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {BrowserModule, Title} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpClientModule, HttpHeaders, HttpClient} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {Subject, Observable} from 'rxjs';


// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
// import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";

// // various services we need on global app level
import {configurationService} from "../../services/configuration.service";
import {loginService, loginCheck} from "../../services/login.service";
import {session} from "../../services/session.service";
import {
    metadata,
    aclCheck
} from "../../services/metadata.service";
// import {AppDataService} from "../services/appdata.service";
import {MathExpressionCompilerService} from "../../services/mathexpressioncompiler";
import {language} from "../../services/language.service";
import {recent} from "../../services/recent.service";
import {userpreferences} from "../../services/userpreferences.service";
import {fts} from "../../services/fts.service";
import {loader} from "../../services/loader.service";
import {broadcast} from "../../services/broadcast.service";
import {dockedComposer} from "../../services/dockedcomposer.service";
import {backend} from "../../services/backend.service";
import {navigation} from "../../services/navigation.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {favorite} from "../../services/favorite.service";
import {reminder} from "../../services/reminder.service";
import {territories} from "../../services/territories.service";
import {currency} from "../../services/currency.service";
import {footer} from "../../services/footer.service";
import {cookie} from "../../services/cookie.service";
// import {assistant} from "../services/assistant.service";
import {VersionManagerService} from "../../services/versionmanager.service";
import {modal} from "../../services/modal.service";
import {layout} from "../../services/layout.service";


import {ModuleGroupware} from "../../include/groupware/groupware";
import {GroupwareService} from '../../include/groupware/services/groupware.service';

import /*embed*/ {OutlookConfiguration} from './services/outlookconfiguration.service';
import /*embed*/ {OutlookGroupware} from "./services/outlookgroupware.service";


import /*embed*/ {OutlookPane} from './components/outlookpane';
import /*embed*/ {OutlookRouteHandler} from './components/outlookroutehandler';
import /*embed*/ {OutlookSettingsPane} from './components/outlooksettingspane';
import /*embed*/ {OutlookLoginPane} from "./components/outlookloginpane";
import {GlobalLogin} from "../../globalcomponents/components/globallogin";
import {loggerService} from "../../services/logger.service";

declare var Office: any;

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        // GlobalComponents,
        ObjectComponents,
        ModuleGroupware,
        RouterModule.forRoot([
            {path: 'settings', component: OutlookSettingsPane},
            {path: 'login', component: OutlookLoginPane},
            {path: "", component: OutlookRouteHandler, pathMatch: "full", canActivate: [loginCheck]}
        ])
    ],
    declarations: [
        OutlookPane,
        OutlookRouteHandler,
        OutlookSettingsPane,
        OutlookLoginPane,
    ],
    bootstrap: [OutlookPane],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: GroupwareService, useClass: OutlookGroupware},
        OutlookConfiguration,
        //
        // // gobal items
        backend,
        broadcast,
        layout,
        navigation,
        session,
        metadata,
        // AppDataService,
        aclCheck,
        loginCheck,
        loginService,
        loader,
        configurationService,
        language,
        dockedComposer,
        fts,
        recent,
        // SystemJsNgModuleLoader,
        modelutilities,
        toast,
        favorite,
        reminder,
        territories,
        currency,
        footer,
        userpreferences,
        cookie,
        MathExpressionCompilerService,
        // assistant,
        VersionManagerService,
        modal,
        loggerService
        // Title
        //
    ]
})
export class Outlook {
}

// set prod mode
// enableProdMode();

Office.initialize = reason => {
    platformBrowserDynamic().bootstrapModule(Outlook).catch(error => console.error(error));
};
