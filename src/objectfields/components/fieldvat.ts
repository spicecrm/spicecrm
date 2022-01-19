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
    templateUrl: '../templates/fieldvat.html'
})

export class fieldVat extends fieldGeneric {

    public isvalidating: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public backend: backend, public toast: toast) {
        super(model, view, language, metadata, router);
    }

    get vatDetailsField() {
        return this.fieldconfig.vatdetails ? this.fieldconfig.vatdetails : 'vat_details';
    }

    public validate() {
        this.isvalidating = true;
        this.backend.getRequest(`common/VIES/${this.value}`).subscribe(
            (response: any) => {
                if (response.status == 'success') {
                    if (response.data.valid !== true) {
                        this.toast.sendToast(this.language.getLabel('ERR_INVALID_VAT'), 'error');
                    }
                    this.model.setField('vat_details', JSON.stringify(response.data));
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
