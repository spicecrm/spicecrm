/**
 * @module Outlook
 */
import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
    SystemJsNgModuleLoader
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
import {telephony} from "../../services/telephony.service";
import {toast} from "../../services/toast.service";
import {favorite} from "../../services/favorite.service";
import {reminder} from "../../services/reminder.service";
import {territories} from "../../services/territories.service";
import {currency} from "../../services/currency.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";
import {layout} from "../../services/layout.service";
import {loggerService} from "../../services/logger.service";
import {socket} from "../../services/socket.service";
import {SystemDynamicRouteInterceptor} from "../../systemcomponents/components/systemdynamicrouteinterceptor";

import {model} from "../../services/model.service";
import {ModuleGroupware} from "../../include/groupware/groupware";
import {GroupwareService} from '../../include/groupware/services/groupware.service';

import /*embed*/ {outlookNameValuePairI} from "./interfaces/outlook.interfaces";

import /*embed*/ {OutlookConfiguration} from './services/outlookconfiguration.service';
import /*embed*/ {OutlookGroupware} from "./services/outlookgroupware.service";

import /*embed*/ {OutlookPane} from './components/outlookpane';
import /*embed*/ {OutlookPaneFooter} from './components/outlookpanefooter';
import /*embed*/ {OutlookSettingsPane} from './components/outlooksettingspane';
import /*embed*/ {OutlookLoginPane} from "./components/outlookloginpane";
import /*embed*/ {OutlookCalendarItemEditPane} from "./components/outlookcalendaritemeditpane";
import /*embed*/ {OutlookCalendarItemReadPane} from "./components/outlookcalendaritemreadpane";
import /*embed*/ {OutlookCalendarItemAddContainer} from "./components/outlookcalendaritemaddcontainer";
import /*embed*/ {OutlookCalendarItemViewContainer} from "./components/outlookcalendaritemviewcontainer";
import /*embed*/ {OutlookCalendarItemEditContainer} from "./components/outlookcalendaritemeditcontainer";

declare var Office: any;

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
            {path: 'login', component: OutlookLoginPane},
            {path: "", component: SystemDynamicRouteInterceptor, pathMatch: "full", canActivate: [loginCheck]},
            {path: '**', component: SystemDynamicRouteInterceptor, canActivate: [loginCheck]}
        ])
    ],
    declarations: [
        OutlookPane,
        OutlookPaneFooter,
        OutlookSettingsPane,
        OutlookLoginPane,
        OutlookCalendarItemEditPane,
        OutlookCalendarItemReadPane,
        OutlookCalendarItemAddContainer,
        OutlookCalendarItemViewContainer,
        OutlookCalendarItemEditContainer
    ],
    bootstrap: [OutlookPane],
    providers: [
        model,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: GroupwareService, useClass: OutlookGroupware},
        aclCheck,
        backend,
        broadcast,
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
        loggerService,
        loginCheck,
        loginService,
        MathExpressionCompilerService,
        metadata,
        modal,
        navigation,
        modelutilities,
        OutlookConfiguration,
        recent,
        reminder,
        session,
        socket,
        territories,
        telephony,
        toast,
        userpreferences,
        notification,
        subscription
    ]
})
export class Outlook {
    constructor(private navigation: navigation) {
        this.navigation.enforceNavigationParadigm('simple');
    }
}

// set prod mode
enableProdMode();

Office.onReady().then(() => {
    platformBrowserDynamic().bootstrapModule(Outlook).catch(error => console.error(error));
});
