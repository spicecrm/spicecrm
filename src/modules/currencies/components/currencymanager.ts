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
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {currency} from '../../../services/currency.service';
import {toast} from "../../../services/toast.service";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'currency-manager',
    templateUrl: './src/modules/currencies/templates/currencymanager.html',
    providers: [view, model]
})

export class CurrencyManager implements OnInit {
    private currencies: any = [];
    private loading: boolean = true;


    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private currency: currency,
        private model: model,
        private modal: modal,
        private toast: toast,
        private view: view
    ) {

    }

    /**
     * gets the currencies from backend
     */
   public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('currencies').subscribe(data => {
                if (data) {
                    for (let currency of data) {
                        this.currencies.push({
                            id: currency.id,
                            name: currency.name,
                            iso: currency.iso4217,
                            symbol: currency.symbol,
                            conversion_rate: currency.conversion_rate
                        });
                    }
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
                this.loading = false;
                modalRef.instance.self.destroy();
            });

        });
    }

    /**
     * reload the currencies when the event emitter has been emitted
     * @param event: boolean
     */
    private reload(event) {
        if(event) {
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                this.backend.getRequest('currencies').subscribe(data => {
                    if (data) {
                        this.currencies = data;
                        this.currencies.shift();
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    }
                    this.loading = false;
                    modalRef.instance.self.destroy();
                });
            });
        }

    }

}
