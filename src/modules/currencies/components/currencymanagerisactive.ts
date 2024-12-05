/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
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
    selector: 'currency-manager-is-active',
    templateUrl: '../templates/currencymanagerisactive.html'
})

export class CurrencyManagerIsActive  {

    /**
     * reference to the button so we can blur after the click (if not the button stays focused and red whioch is confusing
     */
    @ViewChild('activatebutton', {read: ViewContainerRef, static: false}) public activatebutton: ViewContainerRef;

    /**
     * the currency record
     */
    @Input() public currency: sysCurrency;

    /**
     * en emitter if the system currency changed
     */
    @Output() public currencyInactive: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public backend: backend,
    ) {

    }

    /**
     * a getter for the color
     */
    get color(){
        return this.currency.is_inactive == 1 ? 'slds-icon-text-default' : 'slds-icon-text-success';
    }

    /**
     * toggles the active state for the currency
     */
    public toggle(){
        switch (this.currency.is_inactive){
            case 1:
                this.backend.putRequest(`system/currencies/${this.currency.id}/active`).subscribe({
                    next: (res) => {
                        this.currencyInactive.emit(false);
                    }
                })
                break;
            default:
                this.backend.deleteRequest(`system/currencies/${this.currency.id}/active`).subscribe({
                    next: (res) => {
                        this.currencyInactive.emit(true);
                    }
                })
                break;
        }
        // remove the focus
        this.activatebutton.element.nativeElement.blur();
    }
}
