/**
 * @module ModuleProducts
 */
import {Component, ElementRef, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-browser-attribute-n-search',
    templateUrl: '../templates/productbrowserattributensearch.html'
})
export class ProductBrowserAttributeNSearch {

    @Input() public attribute: any = {};
    public timeout: any;

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public productfinder: productfinder) {

    }

    get fromValue() {
        try {
            return this.productfinder.searchfilters[this.attribute.id].valuefrom;
        } catch (e) {
            return '';
        }
    }

    set fromValue(value) {
        if (!this.productfinder.searchfilters[this.attribute.id]) this.productfinder.searchfilters[this.attribute.id] = {};
        this.productfinder.searchfilters[this.attribute.id].valuefrom = value;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.productfinder.getProductVariants(), 500);
    }

    get toValue() {
        try {
            return this.productfinder.searchfilters[this.attribute.id].valueto;
        } catch (e) {
            return '';
        }
    }

    set toValue(value) {
        if (!this.productfinder.searchfilters[this.attribute.id]) this.productfinder.searchfilters[this.attribute.id] = {};
        this.productfinder.searchfilters[this.attribute.id].valueto = value;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.productfinder.getProductVariants(), 500);
    }

    get uom() {
        return this.attribute.uom;
    }
}
