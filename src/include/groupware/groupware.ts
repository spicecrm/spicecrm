/**
 * @module ModuleGroupware
 */
import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {DirectivesModule} from "../../directives/directives";
import {loginCheck} from "../../services/login.service";
import {ObjectFields} from "../../objectfields/objectfields";

import /*embed*/ {GroupwareService} from './services/groupware.service';

import /*embed*/ {GroupwarePaneBean} from './components/groupwarepanebean';
import /*embed*/ {GroupwarePaneAttachment} from './components/groupwarepaneattachment';
import /*embed*/ {GroupwareReadPane} from './components/groupwarereadpane';
import /*embed*/ {GroupwareReadPaneHeader} from './components/groupwarereadpaneheader';
import /*embed*/ {GroupwareReadPaneAttachments} from './components/groupwarereadpaneattachments';
import /*embed*/ {GroupwareReadPaneBeans} from './components/groupwarereadpanebeans';
import /*embed*/ {GroupwareReadPaneLinked} from './components/groupwarereadpanelinked';
import /*embed*/ {GroupwareReadPaneSearch} from './components/groupwarereadpanesearch';
import /*embed*/ {GroupwareDetailPane} from './components/groupwaredetailpane';
import /*embed*/ {GroupwareDetailPaneHeader} from './components/groupwaredetailpaneheader';
import /*embed*/ {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import /*embed*/ {GroupwareMeetingPane} from "./components/groupwaremeetingpane";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        DirectivesModule,
        ObjectFields,
        RouterModule.forRoot([
            {path: 'meeting', component: GroupwareMeetingPane, canActivate: [loginCheck]},
        ])
    ],
    declarations: [
        GroupwarePaneBean,
        GroupwarePaneAttachment,
        GroupwareReadPane,
        GroupwareReadPaneHeader,
        GroupwareReadPaneAttachments,
        GroupwareReadPaneBeans,
        GroupwareReadPaneLinked,
        GroupwareReadPaneSearch,
        GroupwareDetailPane,
        GroupwareDetailPaneHeader,
        GroupwareDetailPaneBean,
        GroupwareMeetingPane,
    ]
})
export class ModuleGroupware {
}
