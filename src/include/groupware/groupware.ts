/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
