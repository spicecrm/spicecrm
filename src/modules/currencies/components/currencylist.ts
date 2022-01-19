/**
 * @module ModuleCurrencies
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'currency-list',
    templateUrl: '../templates/currencylist.html'
})

export class CurrencyList implements OnInit {
    @Input() public currencies: any = [];
    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal
    ) {

    }

    /**
     * just to prevent the default currency from popping up in the list for no reason
     */
    public ngOnInit() {
        this.currencies.shift();
    }

}

