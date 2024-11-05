/**
 * @module ModuleCurrencies
 */
import {Component, Input, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {sysCurrency, sysCurrencyExchangeRate} from "../interfaces/currencies.interfaces";

@Component({
    selector: 'currency-manager-exchangerate-modal',
    templateUrl: '../templates/currencymanagerexchangeratemodal.html',
    providers: [view, model]
})

export class CurrencyManagerExchangerateModal implements OnInit {

    /**
     * reference to the modal
     */
    public self: any;

    /**
     * the currency id
     */
    @Input() public currency: sysCurrency;

    /**
     * the exchange Rates
     */
    public exchangerates: sysCurrencyExchangeRate[] = [];

    constructor(
        public backend: backend,
        public model: model,
        public modal: modal
    ) {

    }

    /**
     * gets the currencies from backend
     */
    public ngOnInit() {
        this.backend.getRequest(`system/currencies/${this.currency.id}/rates`).subscribe({
            next: (exchangerates) => {
                this.exchangerates = exchangerates;
            }
        })
    }

    public close() {
        this.self.destroy();
    }
}
