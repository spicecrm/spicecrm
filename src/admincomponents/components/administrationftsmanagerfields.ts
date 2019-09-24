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
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfields.html'
})
export class AdministrationFTSManagerFields {

    public currentfield: string = '';
    public fieldDetails: any = {};
    public displayAddFieldModal: boolean = false;

    constructor(private metadata: metadata,
                private language: language,
                private modal: modal,
                private injector: Injector,
                private ftsconfiguration: ftsconfiguration) {

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

