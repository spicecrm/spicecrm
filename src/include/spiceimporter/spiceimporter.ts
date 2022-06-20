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

import {SpiceImporterService} from './services/spiceimporter.service';

import {SpiceImporterImportButton} from './components/spiceimporterimportbutton';
import {SpiceImporterSelect} from './components/spiceimporterselect';
import {SpiceImporterMap} from './components/spiceimportermap';
import {SpiceImporterFixed} from './components/spiceimporterfixed';
import {SpiceImporterCheck} from './components/spiceimportercheck';
import {SpiceImporterUpdate} from "./components/spiceimporterupdate";
import {SpiceImporterResult} from './components/spiceimporterresult';
import {SpiceImporter} from './components/spiceimporter';

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
    providers: [SpiceImporterService]
})
export class SpiceImporterModule {
}
