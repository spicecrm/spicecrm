import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-vat',
    templateUrl: './src/objectfields/templates/fieldvat.html'
})

export class fieldVat extends fieldGeneric
{

    isvalidating: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private toast: toast) {
        super(model, view, language, metadata, router);
    }

    get vatDetailsField() {
        return this.fieldconfig['vatdetails'] ? this.fieldconfig['vatdetails'] : 'vat_details';
    }

    validate() {
        this.isvalidating = true;
        this.backend.getRequest('module/Accounts/VIES/' + this.model.data[this.fieldname]).subscribe((response: any) => {
            if (response.status == 'success') {
                if (response.data.valid !== true) {
                    this.toast.sendToast('VAT ID is not valid', 'error');
                }
                this.model.data.vat_details = JSON.stringify(response.data);
            } else {
                this.toast.sendToast('Error checking VAT', 'error');
            }
            this.isvalidating = false;
        })
    }

    get cancheck() {
        if (this.model.data[this.fieldname] && this.model.data[this.fieldname].length > 3)
            return true;
        else
            return false;
    }

    get isvalid() {
        if (!this.model.data[this.vatDetailsField]) return false;

        let vatInfo = JSON.parse(this.model.data[this.vatDetailsField]);
        return vatInfo.valid;
    }

    get vatInfo() {
        let vatInfo = JSON.parse(this.model.data[this.vatDetailsField]);
        return vatInfo.name + '\n' + vatInfo.address;
    }
}