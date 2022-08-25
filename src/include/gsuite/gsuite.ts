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
import {ModuleGroupware} from "../groupware/groupware";

import {GSuitePane} from './components/gsuitepane';
import {GSuitePaneFooter} from './components/gsuitepanefooter';
import {GSuitePaneDefault} from "./components/gsuitepanedefault";
import {GSuiteLoginPane} from "./components/gsuiteloginpane";

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
        RouterModule
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
