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
    templateUrl: './src/modules/currencies/templates/addcurrencyitem.html'
})

export class AddCurrencyItem{
    @Output() private new: EventEmitter<any> = new EventEmitter<any>();
    private name: string;
    private iso: string;
    private symbol: string;
    private conversion_rate: string;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private toast: toast,
    ) {

    }

    private addCurrencyItem() {
        let body = {
            name: this.name,
            iso: this.iso,
            symbol: this.symbol,
            conversion_rate: this.conversion_rate
        }
        this.backend.postRequest('currencies/add', {}, body).subscribe( res => {
            if(!res.status) {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }else{
                this.new.emit(true);
            }
        });
    }

}

