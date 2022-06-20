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

import {GroupwareEmail} from "./interfaces/groupwareemail.interface";

import {GroupwareService} from './services/groupware.service';

import {GroupwarePaneBean} from './components/groupwarepanebean';
import {GroupwarePaneNoBeansFound} from './components/groupwarepanenobeansfound';
import {GroupwareDetailPaneView} from './components/groupwaredetailpaneview';
import {GroupwareEmailArchivePaneAttachment} from './components/groupwareemailarchivepaneattachment';
import {GroupwareEmailArchivePane} from './components/groupwareemailarchivepane';
import {GroupwareEmailArchivePaneHeader} from './components/groupwareemailarchivepaneheader';
import {GroupwareEmailArchivePaneAttachments} from './components/groupwareemailarchivepaneattachments';
import {GroupwareEmailArchivePaneBeans} from './components/groupwareemailarchivepanebeans';
import {GroupwareEmailArchivePaneLinked} from './components/groupwareemailarchivepanelinked';
import {GroupwareEmailArchivePaneSearch} from './components/groupwareemailarchivepanesearch';
import {GroupwareEmailArchivePaneItem} from './components/groupwareemailarchivepaneitem';
import {GroupwareDetailPanefooter} from './components/groupwaredetailpanefooter';
import {GroupwareDetailPaneHeader} from './components/groupwaredetailpaneheader';
import {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import {GroupwareDetailPane} from './components/groupwaredetailpane';

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
