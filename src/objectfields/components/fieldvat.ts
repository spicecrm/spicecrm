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
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-vat',
    templateUrl: './src/objectfields/templates/fieldvat.html'
})

export class fieldVat extends fieldGeneric {

    private isvalidating: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private toast: toast) {
        super(model, view, language, metadata, router);
    }

    get vatDetailsField() {
        return this.fieldconfig.vatdetails ? this.fieldconfig.vatdetails : 'vat_details';
    }

    private validate() {
        this.isvalidating = true;
        this.backend.getRequest(`common/VIES/${this.value}`).subscribe(
            (response: any) => {
                if (response.status == 'success') {
                    if (response.data.valid !== true) {
                        this.toast.sendToast(this.language.getLabel('ERR_INVALID_VAT'), 'error');
                    }
                    this.model.data.vat_details = JSON.stringify(response.data);
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_CHECK_VAT'), 'error');
                }
                this.isvalidating = false;
            },
            () => {
                this.isvalidating = false;
                this.toast.sendToast(this.language.getLabel('ERR_CHECK_VAT'), 'error');
            }
        );
    }

    get cancheck() {
        return (this.value && this.value.length > 3);
    }

    get isvalid() {
        if (!this.model.getField(this.vatDetailsField)) return false;

        let vatInfo = JSON.parse(this.model.getField(this.vatDetailsField));
        return vatInfo.valid;
    }

    get vatInfo() {
        let vatInfo = JSON.parse(this.model.getField(this.vatDetailsField));
        return vatInfo.name + '\n' + vatInfo.address;
    }
}
