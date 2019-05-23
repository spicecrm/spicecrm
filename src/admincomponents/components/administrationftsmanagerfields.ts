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
    selector: 'administration-ftsmanager-fields',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfields.html'
})
export class AdministrationFTSManagerFields {

    public currentfield: string = '';
    public fieldDetails: any = {};
    public displayAddFieldModal: boolean = false;
    constructor(private metadata: metadata, private language: language, private ftsconfiguration: ftsconfiguration) {

    }

    public selectField(id) {
        this.currentfield = id;
        this.fieldDetails = this.ftsconfiguration.getFieldDetails(id);
    }

    get moduleFtsFields() {
        return this.ftsconfiguration.moduleFtsFields;
    }

    get aggregateaddparams() {
        return this.fieldDetails.aggregateaddparams ? atob(this.fieldDetails.aggregateaddparams) : '';
    }
    set aggregateaddparams(value) {
        this.fieldDetails.aggregateaddparams = value ? btoa(value) : '';
    }

    public showAddFields() {
        this.displayAddFieldModal = true;
    }

    public closeAddFields(event) {
        this.displayAddFieldModal = false;
    }

}

