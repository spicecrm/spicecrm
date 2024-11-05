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
import {sysCurrency} from "../interfaces/currencies.interfaces";

@Component({
    selector: 'currency-manager',
    templateUrl: '../templates/currencymanager.html'
})

export class CurrencyManager implements OnInit {

    /**
     * the loaded currencies
     */
    public _currencies: sysCurrency[] = [];

    /**
     * loading indicator
     */
    public loading: boolean = true;

    /**
     * a search string
     */
    public filterString: string = '';

    /**
     * identifies if we have a systemcurency
     */
    public hasSystemCurrency: boolean = true;

    constructor(
        public backend: backend,
        public currency: currency,
        public modal: modal,
        public toast: toast,
    ) {

    }

    /**
     * gets the currencies from backend
     */
    public ngOnInit() {
        this.loadCurrencies();
    }

    private loadCurrencies(){
        this.backend.getRequest('system/currencies').subscribe({
            next: (currencies) => {
                this._currencies = currencies.sort((a, b) => a.name.localeCompare(b.name));

                // check if we have a system currency
                this.hasSystemCurrency = this._currencies.filter(c => c.is_systemcurrency == 1).length > 0;

                this.loading = false;
            }
        })
    }

    public openRates(currency: sysCurrency){
        let awaitmodal = this.modal.await('LBL_LOADING')
        this.modal.openModal('CurrencyManagerExchangerateModal').subscribe({
            next: (modal) => {
                modal.instance.currency = currency;
                awaitmodal.emit(true);
            },
            error: (e)  => {
                awaitmodal.emit(true);
            }
        })
    }

    get currencies(){
        return this.filterString ? this._currencies.filter(c => c.name.toLowerCase().indexOf(this.filterString.toLowerCase()) >= 0) : this._currencies
    }

    public setSystemCurrency(currencyId){
        let currentSystemCurrency = this._currencies.find(c => c.is_systemcurrency == 1);
        if(currentSystemCurrency) currentSystemCurrency.is_systemcurrency = 0;
        this._currencies.find(c => c.id == currencyId).is_systemcurrency = 1;
    }

    public setCurrencyInactive(currencId, inactive){
        this._currencies.find(c => c.id == currencId).is_inactive = inactive ? 1 : 0;
        //this._currencies = [];
        //this.loadCurrencies();
    }
}
