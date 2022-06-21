/**
 * @module SpiceBCardReaderModule
 */
import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
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

import {SpiceBCardReaderButton} from './components/spicebcardreaderbutton';

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
        SpiceBCardReaderButton,
    ]
})
export class SpiceBCardReaderModule {
}
