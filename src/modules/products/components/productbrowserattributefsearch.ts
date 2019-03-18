import {Component} from '@angular/core';
/**
 * @module ModuleProducts
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {productfinder} from '../services/productfinder.service';
import {ProductBrowserAttributeVCSearch} from './productbrowserattributevcsearch';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'product-browser-attribute-f-search',
    templateUrl: './src/modules/products/templates/productbrowserattributefsearch.html'
})
export class ProductBrowserAttributeFSearch extends ProductBrowserAttributeVCSearch {

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder);
    }
}
