/**
 * @module SpiceImporterModule
 */
import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
    SystemJsNgModuleLoader
} from '@angular/core';
import {NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {BrowserModule, Title} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpClientModule, HttpHeaders, HttpClient} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {Subject, Observable} from 'rxjs';

// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";

import /*embed*/ {SpiceImporterService} from './services/spiceimporter.service';

import /*embed*/ {SpiceImporterImportButton} from './components/spiceimporterimportbutton';
import /*embed*/ {SpiceImporterSelect} from './components/spiceimporterselect';
import /*embed*/ {SpiceImporterMap} from './components/spiceimportermap';
import /*embed*/ {SpiceImporterFixed} from './components/spiceimporterfixed';
import /*embed*/ {SpiceImporterCheck} from './components/spiceimportercheck';
import /*embed*/ {SpiceImporterUpdate} from "./components/spiceimporterupdate";
import /*embed*/ {SpiceImporterResult} from './components/spiceimporterresult';
import /*embed*/ {SpiceImporter} from './components/spiceimporter';

import {ObjectFields} from "../../objectfields/objectfields";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        ObjectFields
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
