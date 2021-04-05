/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SpiceImporterModule
 */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {SpiceImporterService} from './services/spiceimporter.service';

import /*embed*/ {SpiceImporterImportButton} from './components/spiceimporterimportbutton';
import /*embed*/ {SpiceImporterSelect} from './components/spiceimporterselect';
import /*embed*/ {SpiceImporterMap} from './components/spiceimportermap';
import /*embed*/ {SpiceImporterFixed} from './components/spiceimporterfixed';
import /*embed*/ {SpiceImporterCheck} from './components/spiceimportercheck';
import /*embed*/ {SpiceImporterUpdate} from "./components/spiceimporterupdate";
import /*embed*/ {SpiceImporterResult} from './components/spiceimporterresult';
import /*embed*/ {SpiceImporter} from './components/spiceimporter';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        ObjectFields,
        DirectivesModule
    ],
    declarations: [
        SpiceImporter,
        SpiceImporterSelect,
        SpiceImporterMap,
        SpiceImporterFixed,
        SpiceImporterCheck,
        SpiceImporterUpdate,
        SpiceImporterResult,
        SpiceImporterImportButton
    ],
    exports: [
        SpiceImporter,
        SpiceImporterImportButton
    ],
    entryComponents: [
        SpiceImporter,
        SpiceImporterImportButton
    ],
    providers: [SpiceImporterService]
})
export class SpiceImporterModule {
}
