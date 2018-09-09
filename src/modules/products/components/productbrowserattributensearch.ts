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


declare var moment: any;

@Component({
    selector: 'product-browser-attribute-n-search',
    templateUrl: './src/modules/products/templates/productbrowserattributensearch.html'
})
export class ProductBrowserAttributeNSearch {

    @Input() attribute : any = {};

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {

    }

    get fromValue(){
        try{
            return this.productfinder.searchfilters[this.attribute.id].valuefrom;
        } catch(e){
            return '';
        }
    }

    set fromValue(value){
        if(!this.productfinder.searchfilters[this.attribute.id]) this.productfinder.searchfilters[this.attribute.id] = {};
        this.productfinder.searchfilters[this.attribute.id].valuefrom = value;
    }

    get toValue(){
        try{
            return this.productfinder.searchfilters[this.attribute.id].valueto;
        } catch(e){
            return '';
        }
    }

    set toValue(value){
        if(!this.productfinder.searchfilters[this.attribute.id]) this.productfinder.searchfilters[this.attribute.id] = {};
        this.productfinder.searchfilters[this.attribute.id].valueto = value;
    }

    keyUp(_e) {

        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                this.productfinder.getProductVariants();
                break;
        }
    }

    get uom(){
        return this.attribute.uom;
    }
}