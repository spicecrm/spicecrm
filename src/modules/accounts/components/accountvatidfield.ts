/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {Router} from '@angular/router';

import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {fieldEnum} from "../../../objectfields/components/fieldenum";
import {relatedmodels} from "../../../services/relatedmodels.service";


@Component({
    selector: 'account-vatid-field',
    templateUrl: './src/modules/accounts/templates/accountvatidfield.html',
    providers: [relatedmodels],
})

export class AccountVATIDField extends fieldGeneric implements OnInit {

    isvalidating: boolean = false;
    vatids: any = [];
    constructor(public model: model, public relatedmodels: relatedmodels, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private toast: toast) {
        super(model, view, language, metadata, router);

    }

    public ngOnInit() {
        this.model.module = 'Accounts';
        window.console.log(this.model.data);
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = 'AccountVATIDs';
        this.loadRelated();

    }

    private loadRelated() {
        this.relatedmodels.loaditems = -99;
        this.relatedmodels.getData().subscribe(response => {
            if (response) {
                window.console.log(this.relatedmodels.items);
                this.vatids = this.relatedmodels.items;
            }
        });
    }
    get vatDetailsField() {
        return this.fieldconfig['vatdetails'] ? this.fieldconfig['vatdetails'] : 'vat_details';
    }

    public validate() {
        this.isvalidating = true;
        // `/module/EmailSchedules/checkRelated/${this.model.module}/${this.model.id}`
        this.backend.getRequest('module/AccountVATIDs/VIES/' + this.model.data).subscribe((response: any) => {
            if (response.status == 'success') {
                if (response.data.valid !== true) {
                    this.toast.sendToast(this.language.getLabel('ERR_INVALID_VAT'), 'error');
                }
                this.model.data.vat_details = JSON.stringify(response.data);
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_CHECK_VAT'), 'error');
            }
            this.isvalidating = false;
        });
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
