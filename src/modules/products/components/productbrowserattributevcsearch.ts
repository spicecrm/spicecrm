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
    selector: 'product-browser-attribute-vc-search',
    templateUrl: './src/modules/products/templates/productbrowserattributevcsearch.html'
})
export class ProductBrowserAttributeVCSearch {

    @Input() attribute : any = {};
    autosearch = false;

    constructor(public language: language, public productfinder: productfinder) {

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

    keyUp(_e) {

        // handle the key pressed
        switch (_e.key) {

            case 'Enter':
                this.productfinder.getProductVariants();
                break;
        }
    }


}