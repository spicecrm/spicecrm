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
import {model} from "../../../services/model.service";

@Component({
    selector: 'system-currency',
    templateUrl: './src/modules/currencies/templates/systemcurrency.html'
})

export class SystemCurrency implements OnInit {
    @Input() private currencies: any = [];
    private loading: boolean = false;
    private defaultCurrency: any = {};
    private selectedCurrency: any = {};
    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private view: view,
        private toast: toast,
        private model: model,
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
        this.selectedCurrency = this.defaultCurrency;
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

    /**
     * save the selected currency as the default currency of the system in the config table
     */
    private savePreference() {

        let body = [
            {name: 'default_currency_iso4217', value: this.selectedCurrency.iso},
            {name: 'default_currency_name', value: this.selectedCurrency.name},
            {name: 'default_currency_symbol', value: this.selectedCurrency.symbol},
        ];
        this.backend.postRequest('admin/writesettings', {}, body).subscribe( response => {
            if(!response.status) {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            } else {
                this.defaultCurrency = this.selectedCurrency;
            }
        });
        this.view.setViewMode();
    }

}
