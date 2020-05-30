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
    @Input() currencies: any = [];
    private prefCurrency: any = {};
    private loading: boolean = true;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private view: view,
        private toast: toast
    ) {

    }

    ngOnInit() {
        this.backend.getRequest('currencies/defaultcurrency').subscribe(data => {
            if (data.status) {
                this.prefCurrency = this.currencies.find(currency => currency.id == data.currency);
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
            this.loading = false;
        });
    }


}
