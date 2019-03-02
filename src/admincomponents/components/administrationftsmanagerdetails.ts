/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';


@Component({
    selector: 'administration-ftsmanager-details',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerdetails.html'
})
export class AdministrationFTSManagerDetails {

    constructor(private metadata: metadata, private language: language, private ftsconfiguration: ftsconfiguration) {

    }

}

