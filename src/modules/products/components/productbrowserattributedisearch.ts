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
    selector: 'product-browser-attribute-di-search',
    templateUrl: './app/modules/products/templates/productbrowserattributedisearch.html'
})
export class ProductBrowserAttributeDISearch extends ProductBrowserAttributeVCSearch {


    constructor(public language: language, public productfinder: productfinder) {
        super(language, productfinder)
        this.autosearch = true;
    }

    get attributevalues() {
        let retArray = [];

        if (this.attribute.validations)
            for (let validation of this.attribute.validations)
                retArray.push(validation.value);

        return retArray
    }

}