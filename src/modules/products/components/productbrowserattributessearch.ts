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

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder);
        this.autosearch = true;
    }

    get attributeValues() {
        return this.attribute.validations ? this.attribute.validations
            .map(validation => {
                validation = validation.value;
                return validation;
            }) : [];
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
        if (this.autosearch) {
            this.productfinder.getProductVariants();
        }
    }

    private checkEnumOption(value, checked) {
        let enumArray = this.value.length > 0 ? this.value.split(",") : [];
        enumArray = enumArray.filter(item => item != value);
        if (checked) {
            enumArray.push(value);
        }
        this.value = enumArray.toString();
    }

    private enumOptionValue(value) {
        return !!this.value.includes(value);
    }
}