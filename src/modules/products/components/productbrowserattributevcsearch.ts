import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';

@Component({
    selector: 'product-browser-attribute-vc-search',
    templateUrl: './src/modules/products/templates/productbrowserattributevcsearch.html'
})
export class ProductBrowserAttributeVCSearch {

    @Input() attribute: any = {};
    private timeout: any;

    constructor(public language: language, public productfinder: productfinder) {
    }

    get value() {
        try {
            return this.productfinder.searchfilters[this.attribute.id].value;
        } catch (e) {
            return '';
        }
    }

    set value(value) {
        if (!this.productfinder.searchfilters[this.attribute.id]) {
            this.productfinder.searchfilters[this.attribute.id] = {};
        }
        this.productfinder.searchfilters[this.attribute.id].value = value;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.productfinder.getProductVariants(true), 500);
    }
}
