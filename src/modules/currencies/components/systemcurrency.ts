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
 * @module ModuleCurrencies
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'system-currency',
    templateUrl: './src/modules/currencies/templates/systemcurrency.html'
})

export class SystemCurrency implements OnInit {
    @Input() private currencies: any = [];
    private loading: boolean = false;
    private defaultCurrency: any = {};
    private iso: string = '';
    private name: string = '';
    private symbol: string = '';

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private view: view,
        private toast: toast,
    ) {

    }

    /**
     * find the default currency
     */
    public ngOnInit() {
        for (let currency of this.currencies) {
            if(currency.id == -99) {
                this.defaultCurrency = currency;
            }
        }
        this.iso = this.defaultCurrency.iso;
        this.name = this.defaultCurrency.name;
        this.symbol = this.defaultCurrency.symbol;
    }

    /**
     * get the edit mode
     */
    private get editMode() {
        return this.view.isEditMode();
    }

    /**
     * set the edit mode
     */
    private edit() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private cancel() {
        this.view.setViewMode();
    }

    /**
     * save the selected currency as the default currency of the system in the config table
     */
    private savePreference() {

        let body = [
            {name: 'default_currency_iso4217', value: this.iso},
            {name: 'default_currency_name', value: this.name},
            {name: 'default_currency_symbol', value: this.symbol},
        ];
        this.backend.postRequest('admin/writesettings', {}, body).subscribe( response => {
            if(!response.status) {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            } else {
                this.defaultCurrency = {
                    iso: this.iso,
                    name: this.name,
                    symbol: this.symbol
                };

            }
        });
        this.view.setViewMode();
    }

}
