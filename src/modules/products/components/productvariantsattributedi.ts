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
import {ProductVariantsAttributeVC} from './productvariantsattributevc';


declare var moment: any;

@Component({
    selector: 'product-variants-attribute-di',
    templateUrl: './app/modules/products/templates/productvariantsattributedi.html'
})
export class ProductVariantsAttributeDI extends ProductVariantsAttributeVC {

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {
        super(language, backend, elementRef, view, model);
    }

    get attributevalues(){
        let retArray = [];

        if(this.attribute.validations) {
            for (let validation of this.attribute.validations) {
                if(validation.value && validation.value != '')
                    retArray.push(validation.value);
            }
        }
        return retArray.sort((a, b) => {return a.toLowerCase() > b.toLowerCase() ? 1 : -1});
    }



}