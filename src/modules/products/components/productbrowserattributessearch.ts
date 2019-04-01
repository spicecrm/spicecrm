import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {ProductBrowserAttributeVCSearch} from './productbrowserattributevcsearch';

declare var moment: any;

@Component({
    selector: 'product-browser-attribute-s-search',
    templateUrl: './src/modules/products/templates/productbrowserattributessearch.html'
})
export class ProductBrowserAttributeSSearch extends ProductBrowserAttributeVCSearch {

    private arrayvalue: any[] = [];

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder);
    }

    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations
            .map(validation => {
                validation = validation.value;
                return validation;
            }) : [];
    }

    get arrayValue() {
        return this.arrayvalue;
    }

    set arrayValue(value) {
        this.arrayvalue = value;
        this.value = value.length > 0 ? value.join(',') : '';
    }
}
