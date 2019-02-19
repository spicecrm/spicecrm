import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {ProductBrowserAttributeVCSearch} from './productbrowserattributevcsearch';

@Component({
    selector: 'product-browser-attribute-di-search',
    templateUrl: './src/modules/products/templates/productbrowserattributedisearch.html'
})
export class ProductBrowserAttributeDISearch extends ProductBrowserAttributeVCSearch {

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder);
        this.autosearch = true;
    }

    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations.map(va => {
            va = va.value;
            return va;
        }) : [];
    }
}
