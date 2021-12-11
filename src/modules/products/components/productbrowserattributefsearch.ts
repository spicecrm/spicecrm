/**
 * @module ModuleProducts
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {ProductBrowserAttributeVCSearch} from './productbrowserattributevcsearch';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-browser-attribute-f-search',
    templateUrl: '../templates/productbrowserattributefsearch.html'
})
export class ProductBrowserAttributeFSearch extends ProductBrowserAttributeVCSearch {

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder);
    }
}
