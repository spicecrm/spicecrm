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
    templateUrl: './src/modules/currencies/templates/currencylist.html'
})

export class CurrencyList implements OnInit {
    @Input() private currencies: any = [];
    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal
    ) {

    }

    /**
     * just to prevent the default currency from popping up in the list for no reason
     */
    public ngOnInit() {
        this.currencies.shift();
    }

}

