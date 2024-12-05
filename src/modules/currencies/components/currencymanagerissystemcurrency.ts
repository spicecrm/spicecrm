/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {currency} from '../../../services/currency.service';
import {toast} from "../../../services/toast.service";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {sysCurrency} from "../interfaces/currencies.interfaces";
import {OUTPUT_INITIALIZER_FNS} from "@angular/compiler-cli/src/ngtsc/annotations";

@Component({
    selector: 'currency-manager-is-systemcurrency',
    templateUrl: '../templates/currencymanagerissystemcurrency.html'
})

export class CurrencyManagerIsSystemCurrency {

    /**
     * value if the mouse if over the div
     */
    public mouseOver: boolean = false;

    /**
     * the currency
     */
    @Input() public currency: sysCurrency;

    /**
     * to enable that the system currency can be set
     */
    @Input() public canSetSystemCurrency: boolean = false;

    /**
     * en emitter if the system currency changed
     */
    @Output() public systemCurrencySet: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        public backend: backend,
        public modal: modal
    ) {

    }

    public setSystemCurrency() {
        this.modal.prompt('confirm', 'MSG_SET_SYSTEMCURRENCY', 'MSG_SET_SYSTEMCURRENCY').subscribe({
            next: (response) => {
                if (response) {
                    this.backend.putRequest(`system/currencies/${this.currency.id}/systemcurrency`).subscribe({
                        next: (res) => {
                            this.systemCurrencySet.emit(this.currency.id);
                        }
                    })
                }
            }
        })
    }
}
