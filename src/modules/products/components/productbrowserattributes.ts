import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
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
    selector: 'product-browser-attributes',
    templateUrl: './src/modules/products/templates/productbrowserattributes.html'
})
export class ProductBrowserAttributes {

    @ViewChild('attributesheader', {read: ViewContainerRef}) attributesheader: ViewContainerRef;
    attributefilter: string = '';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {

    }

    get hasSearchFilters(){
        return this.productfinder.hasSearchFilters();
    }

    clearFilters(){
        this.productfinder.resetSearchFilters();
    }

    get attributesstyle(){
        let rect = this.attributesheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

    get loading(){
        return this.productfinder.loadingattributes;
    }

    get attributes(){
        let attributes = [];
        for(let attribute of this.productfinder.groupattributes){
            if(attribute.name.toLowerCase().indexOf(this.attributefilter.toLowerCase()) >= 0){
                attributes.push(attribute);
            }
        }
        return attributes;
    }
}