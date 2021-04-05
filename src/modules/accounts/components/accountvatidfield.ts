/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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


@Component({
    selector: 'account-vatid-field',
    templateUrl: './src/modules/accounts/templates/accountvatidfield.html',
})

export class AccountVATIDField extends fieldGeneric implements OnInit {
    isvalidating: boolean = false;
    options: any = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private toast: toast) {
        super(model, view, language, metadata, router);
        // for the language options
        this.subscriptions.add(
            this.language.currentlanguage$.subscribe((language) => {
                this.getOptions();
            })
        );
    }

    get emptyVATIDS() {
        return this.getAccountVATIDs().length > 0;
    }

    /**
     * loads vatids array and options array, initializes field if none is found
     */
    public ngOnInit() {
        this.getOptions();
        if (!this.model.getField('accountvatids')) {
            this.model.initializeField(
                'accountvatids',
                {
                    beans: {},
                    beans_relations_to_delete: {}
                });
        }
        this.getAccountVATIDs();
    }

    /**
     * gets the options for the country dropdown
     */
    public getOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions('AccountVATIDs', 'country');
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        this.options = retArray;
        if (this.fieldconfig.sortdirection) {
            switch (this.fieldconfig.sortdirection.toLowerCase()) {
                case 'desc':
                    this.options.sort((a, b) => a.display.toLowerCase() < b.display.toLowerCase() ? 1 : -1);
                    break;
                case 'asc':
                    this.options.sort((a, b) => a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1);
            }
        }
    }

    /**
     * gets the colors for the visualisation of vatid_status
     * @param beanid
     */
    public getColor(beanid) {
        let color = 'gray';
        switch (this.model.getField('accountvatids').beans[beanid].vatid_status) {
            case 'valid':
                color = "green";
                break;
            case 'not_valid':
                color = "red";
                break;
        }
        return {'background-color': color};
    }

    /**
     * returns an array with all the beans for the link accountvatids
     * @return array
     */
    public getAccountVATIDs() {
        let vatids = [];
        if(this.model.getField('accountvatids')) {
            let beans = this.model.getField('accountvatids');
            for (let i in beans.beans) {
                if (beans.beans[i].deleted != 1) {
                    vatids.push(beans.beans[i]);
                }
            }
        }

        return vatids;
    }

    /**
     * backend request to validate code
     * @param countrycode string
     * @param vatid string
     * @param beanid string
     */
    public validate(countrycode, vatid, beanid) {
        this.isvalidating = true;
        this.backend.getRequest('module/AccountVATIDs/' + countrycode + vatid).subscribe((response: any) => {
            if (response.status == 'success') {
                if (response.data.valid !== true) {
                    this.toast.sendToast(this.language.getLabel('ERR_INVALID_VAT'), 'error');
                    this.model.getField('accountvatids').beans[beanid].vatid_status = 'not_valid';
                } else {
                    this.model.getField('accountvatids').beans[beanid].verification_details = JSON.stringify(response.data);
                    this.model.getField('accountvatids').beans[beanid].vatid_status = 'valid';
                }
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_CHECK_VAT'), 'error');

            }
            this.isvalidating = false;
        });
    }

    /**
     *
     * @param vat_id string
     * @return boolean
     * @private
     */
    private canCheck(vat_id) {
        return vat_id.length > 3;
    }

    /**
     * adds a new entry to the accountvatids beans and reloads the vatids array
     *
     */
    private add() {
        let id = this.model.generateGuid();
        this.model.getField('accountvatids').beans[id] = {
            id: id,
            account_id: this.model.id,
            account_name: this.model.displayname,
            vat_id: '',
            vatid_status: '',
            country: ''
        };
        this.getAccountVATIDs();
    }


    /**
     * sets the deleted flag to true for the selected bean, reloads the array
     * @param beanid string
     * @private
     */
    private delete(beanid) {
        this.model.getField('accountvatids').beans[beanid].deleted = 1;
        this.getAccountVATIDs();
    }

    /**
     * check if the vatid is valid
     * @param beanid string
     * @private
     */
    private isvalid(beanid) {
        if (this.model.getField('accountvatids').beans[beanid]['vatid_status'] == 'valid') {
            return true;
        } else {
            return false;
        }

    }

    /**
     *  returns a string with vat information
     * @param beanid string
     * @return string
     * @private
     */
    private vatInfo(beanid) {
        let vatInfo = JSON.parse(this.model.getField('accountvatids').beans[beanid].verification_details);
        return vatInfo.name + '\n' + vatInfo.address;
    }

}
