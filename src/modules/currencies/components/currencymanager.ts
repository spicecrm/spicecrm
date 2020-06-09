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
     * @param event
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
