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
import /*embed*/ {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import {loginCheck} from "../../services/login.service";
import {ObjectFields} from "../../objectfields/objectfields";

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
            {path: 'mailitem', component: GroupwareReadPane, canActivate: [loginCheck]},
            {path: 'details', component: GroupwareDetailPane, canActivate: [loginCheck]},
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
        GroupwareDetailPaneBean,
    ]
})
export class ModuleGroupware {
}
