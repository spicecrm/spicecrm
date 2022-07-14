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
import {loginCheck} from "../../services/login.service";

import {SystemDynamicRouteInterceptor} from "../../systemcomponents/components/systemdynamicrouteinterceptor";

import {ModuleGroupware} from "../groupware/groupware";
import {GroupwareService} from '../groupware/services/groupware.service';

import {OutlookConfiguration} from './services/outlookconfiguration.service';
import {OutlookGroupware} from "./services/outlookgroupware.service";

import {OutlookPane} from './components/outlookpane';
import {OutlookPaneFooter} from './components/outlookpanefooter';
import {OutlookSettingsPane} from './components/outlooksettingspane';
import {OutlookLoginPane} from "./components/outlookloginpane";
import {OutlookCalendarItemEditPane} from "./components/outlookcalendaritemeditpane";
import {OutlookCalendarItemReadPane} from "./components/outlookcalendaritemreadpane";
import {OutlookCalendarItemAddContainer} from "./components/outlookcalendaritemaddcontainer";
import {OutlookCalendarItemViewContainer} from "./components/outlookcalendaritemviewcontainer";
import {OutlookCalendarItemEditContainer} from "./components/outlookcalendaritemeditcontainer";
import {model} from "../../services/model.service";

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
    ]
})
export class Outlook {
    constructor() {
    }
}
