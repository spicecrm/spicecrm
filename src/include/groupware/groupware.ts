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
import {ObjectFields} from "../../objectfields/objectfields";

import /*embed*/ {GroupwareEmail} from "./interfaces/groupwareemail.interface";

import /*embed*/ {GroupwareService} from './services/groupware.service';

import /*embed*/ {GroupwarePaneBean} from './components/groupwarepanebean';
import /*embed*/ {GroupwarePaneNoBeansFound} from './components/groupwarepanenobeansfound';
import /*embed*/ {GroupwareDetailPaneView} from './components/groupwaredetailpaneview';
import /*embed*/ {GroupwareEmailArchivePaneAttachment} from './components/groupwareemailarchivepaneattachment';
import /*embed*/ {GroupwareEmailArchivePane} from './components/groupwareemailarchivepane';
import /*embed*/ {GroupwareEmailArchivePaneHeader} from './components/groupwareemailarchivepaneheader';
import /*embed*/ {GroupwareEmailArchivePaneAttachments} from './components/groupwareemailarchivepaneattachments';
import /*embed*/ {GroupwareEmailArchivePaneBeans} from './components/groupwareemailarchivepanebeans';
import /*embed*/ {GroupwareEmailArchivePaneLinked} from './components/groupwareemailarchivepanelinked';
import /*embed*/ {GroupwareEmailArchivePaneSearch} from './components/groupwareemailarchivepanesearch';
import /*embed*/ {GroupwareEmailArchivePaneItem} from './components/groupwareemailarchivepaneitem';
import /*embed*/ {GroupwareDetailPanefooter} from './components/groupwaredetailpanefooter';
import /*embed*/ {GroupwareDetailPaneHeader} from './components/groupwaredetailpaneheader';
import /*embed*/ {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import /*embed*/ {GroupwareDetailPane} from './components/groupwaredetailpane';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        DirectivesModule,
        ObjectFields
    ],
    declarations: [
        GroupwarePaneBean,
        GroupwarePaneNoBeansFound,
        GroupwareDetailPaneView,
        GroupwareEmailArchivePaneAttachment,
        GroupwareEmailArchivePane,
        GroupwareEmailArchivePaneHeader,
        GroupwareEmailArchivePaneAttachments,
        GroupwareEmailArchivePaneBeans,
        GroupwareEmailArchivePaneLinked,
        GroupwareEmailArchivePaneSearch,
        GroupwareDetailPane,
        GroupwareEmailArchivePaneItem,
        GroupwareDetailPanefooter,
        GroupwareDetailPaneHeader,
        GroupwareDetailPaneBean
    ],
    exports: [
        GroupwareDetailPaneHeader
    ]
})
export class ModuleGroupware {
}
