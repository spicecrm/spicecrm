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
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';
import {productfinder} from '../services/productfinder.service';
import {ProductVariantsAttributeVC} from './productvariantsattributevc';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'product-variants-attribute-n',
    templateUrl: './src/modules/products/templates/productvariantsattributen.html'
})
export class ProductVariantsAttributeN extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    get displayvalue(){
        return parseFloat(this.value);
    }

    get uom(){
        return this.attribute.uom;
    }

}