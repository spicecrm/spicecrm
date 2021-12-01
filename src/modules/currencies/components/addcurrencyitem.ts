/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';


@Component({
    selector: 'add-currency-item',
    templateUrl: '../templates/addcurrencyitem.html'
})

export class AddCurrencyItem {
    @Output() public new: EventEmitter<any> = new EventEmitter<any>();
    public name: string;
    public iso: string;
    public symbol: string;
    public show: boolean = false;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public toast: toast,
    ) {

    }

    /**
     * hide or show the form part of the component
     */
    public toggleShow() {
        this.show = !this.show;
    }
    /**
     * post a currency to the backend and emit true if the request was successful
     */
    public addCurrencyItem() {
        let body = {
            name: this.name,
            iso: this.iso,
            symbol: this.symbol,
        };
        this.backend.postRequest('module/Currencies/add', {}, body).subscribe(res => {
            if (!res.status) {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            } else {
                this.new.emit(true);
            }
        });
    }

}

