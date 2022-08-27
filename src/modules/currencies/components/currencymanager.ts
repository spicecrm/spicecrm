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
    templateUrl: '../templates/currencymanager.html',
    providers: [view, model]
})

export class CurrencyManager implements OnInit {
    public currencies: any = [];
    public loading: boolean = true;


    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public currency: currency,
        public model: model,
        public modal: modal,
        public toast: toast,
        public view: view
    ) {

    }

    /**
     * gets the currencies from backend
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('module/Currencies').subscribe(data => {
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
    public reload(event) {
        if (event) {
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                this.backend.getRequest('module/Currencies').subscribe(data => {
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
