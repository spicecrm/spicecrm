/**
 * @module ModuleGSuite
 */
import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
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
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {DirectivesModule} from "../../directives/directives";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";

// various services we need on global app level
import {configurationService} from "../../services/configuration.service";
import {helper} from "../../services/helper.service";
import {loginService, loginCheck} from "../../services/login.service";
import {notification} from "../../services/notification.service";
import {subscription} from "../../services/subscription.service";
import {session} from "../../services/session.service";
import {
    metadata,
    aclCheck
} from "../../services/metadata.service";
import {MathExpressionCompilerService} from "../../services/mathexpressioncompiler";
import {language} from "../../services/language.service";
import {recent} from "../../services/recent.service";
import {userpreferences} from "../../services/userpreferences.service";
import {fts} from "../../services/fts.service";
import {loader} from "../../services/loader.service";
import {libloader} from "../../services/libloader.service";
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
import {modal} from "../../services/modal.service";
import {layout} from "../../services/layout.service";
import {loggerService} from "../../services/logger.service";
import {telephony} from "../../services/telephony.service";
import {socket} from "../../services/socket.service";
import {SystemDynamicRouteInterceptor} from "../../systemcomponents/components/systemdynamicrouteinterceptor";

import {model} from "../../services/model.service";
import {ModuleGroupware} from "../../include/groupware/groupware";
import {GroupwareService} from '../../include/groupware/services/groupware.service';

import /*embed*/ {GSuiteMessageI, GSuiteAttachmentI} from "./interfaces/gsuite.interfaces";

import /*embed*/ {GSuiteBrokerService} from '../../include/gsuite/services/gsuitebroker.service';
import /*embed*/ {GSuiteGroupware} from "./services/gsuitegroupware.service";

import /*embed*/ {GSuitePane} from './components/gsuitepane';
import /*embed*/ {GSuitePaneFooter} from './components/gsuitepanefooter';
import /*embed*/ {GSuitePaneDefault} from "./components/gsuitepanedefault";
import /*embed*/ {GSuiteLoginPane} from "./components/gsuiteloginpane";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        DirectivesModule,
        GlobalComponents,
        ModuleGroupware,
        RouterModule.forRoot([
            {path: 'login', component: GSuiteLoginPane},
            {path: "", component: SystemDynamicRouteInterceptor, pathMatch: "full", canActivate: [loginCheck]},
            {path: '**', component: SystemDynamicRouteInterceptor, canActivate: [loginCheck]}
        ])
    ],
    declarations: [
        GSuitePane,
        GSuitePaneFooter,
        GSuiteLoginPane,
        GSuitePaneDefault,
    ],
    bootstrap: [GSuitePane],
    providers: [
        model,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: GroupwareService, useClass: GSuiteGroupware},
        GSuiteBrokerService,
        backend,
        broadcast,
        layout,
        navigation,
        session,
        metadata,
        aclCheck,
        helper,
        loginCheck,
        loginService,
        loader,
        libloader,
        configurationService,
        language,
        dockedComposer,
        telephony,
        socket,
        fts,
        recent,
        modelutilities,
        toast,
        favorite,
        reminder,
        territories,
        currency,
        footer,
        userpreferences,
        MathExpressionCompilerService,
        modal,
        loggerService,
        notification,
        subscription
    ]
})
export class ModuleGSuite {
    constructor(public navigation: navigation) {
        // this.navigation.enforceNavigationParadigm('simple');
    }
}

// set prod mode
enableProdMode();

platformBrowserDynamic().bootstrapModule(ModuleGSuite).catch(error => console.error(error));






