/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-ftsmanager-fields',
    templateUrl: '../templates/administrationftsmanagerfields.html'
})
export class AdministrationFTSManagerFields {

    public currentfield: string = '';
    public fieldDetails: any = {};
    public displayAddFieldModal: boolean = false;

    constructor(public metadata: metadata,
                public language: language,
                public modal: modal,
                public injector: Injector,
                public ftsconfiguration: ftsconfiguration) {
        // if the module is changed reset the current field
        this.ftsconfiguration.module$.subscribe(module => {
            this.currentfield = '';
        });
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

    public selectField(id) {
        this.currentfield = id;
        this.fieldDetails = this.ftsconfiguration.getFieldDetails(id);
    }

    public showAddFields() {
        this.modal.openModal('AdministrationFTSManagerFieldsAdd', true, this.injector);
    }

    public closeAddFields(event) {
        this.displayAddFieldModal = false;
    }

}

