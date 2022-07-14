/**
 * @module ModuleGSuite
 */
import {NgModule,} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


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

import {GSuiteBrokerService} from './services/gsuitebroker.service';
import {GSuiteGroupware} from "./services/gsuitegroupware.service";

import {GSuitePane} from './components/gsuitepane';
import {GSuitePaneFooter} from './components/gsuitepanefooter';
import {GSuitePaneDefault} from "./components/gsuitepanedefault";
import {GSuiteLoginPane} from "./components/gsuiteloginpane";
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
    ]
})
export class ModuleGSuite {
}
