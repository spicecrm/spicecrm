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
    templateUrl: '../templates/systemcurrency.html'
})

export class SystemCurrency implements OnInit {
    @Input() public currencies: any = [];
    public loading: boolean = false;
    public defaultCurrency: any = {};
    public iso: string = '';
    public name: string = '';
    public symbol: string = '';

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public view: view,
        public toast: toast,
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
    public get editMode() {
        return this.view.isEditMode();
    }

    /**
     * set the edit mode
     */
    public edit() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public cancel() {
        this.view.setViewMode();
    }

    /**
     * save the selected currency as the default currency of the system in the config table
     */
    public savePreference() {

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
