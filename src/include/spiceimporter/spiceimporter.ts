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
