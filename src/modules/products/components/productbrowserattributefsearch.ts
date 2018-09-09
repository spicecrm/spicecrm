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
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {ProductBrowserAttributeVCSearch} from './productbrowserattributevcsearch';

declare var moment: any;

@Component({
    selector: 'product-browser-attribute-f-search',
    templateUrl: './src/modules/products/templates/productbrowserattributefsearch.html'
})
export class ProductBrowserAttributeFSearch extends ProductBrowserAttributeVCSearch{

    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder)
        this.autosearch = true;
    }

    get value(){
        try{
            return this.productfinder.searchfilters[this.attribute.id].value;
        } catch(e){
            return '';
        }
    }

    set value(value){
        if(!this.productfinder.searchfilters[this.attribute.id]) this.productfinder.searchfilters[this.attribute.id] = {};
        this.productfinder.searchfilters[this.attribute.id].value = value;
        if(this.autosearch)
            this.productfinder.getProductVariants();
    }
}