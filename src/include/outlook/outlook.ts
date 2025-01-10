/**
 * @module Outlook
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

import {OutlookPane} from './components/outlookpane';
import {OutlookPaneFooter} from './components/outlookpanefooter';
import {OutlookLoginPane} from "./components/outlookloginpane";
import {OutlookCalendarItemEditPane} from "./components/outlookcalendaritemeditpane";
import {OutlookCalendarItemReadPane} from "./components/outlookcalendaritemreadpane";
import {OutlookCalendarItemAddContainer} from "./components/outlookcalendaritemaddcontainer";
import {OutlookCalendarItemViewContainer} from "./components/outlookcalendaritemviewcontainer";
import {OutlookCalendarItemEditContainer} from "./components/outlookcalendaritemeditcontainer";

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
        RouterModule,
    ],
    declarations: [
        OutlookPane,
        OutlookPaneFooter,
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
