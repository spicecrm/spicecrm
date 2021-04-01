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

