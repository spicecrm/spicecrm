import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
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

    get hasSearchFilters() {
        return this.productfinder.hasSearchFilters;
    }

    get attributesStyle() {
        let rect = this.attributesheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        };
    }

    get loading() {
        return this.productfinder.loadingAttributes;
    }

    get attributes() {
        let attributes = [];
        for (let attribute of this.productfinder.selectedGroupAttributes) {
            if (attribute.name.toLowerCase().indexOf(this.attributefilter.toLowerCase()) >= 0) {
                attributes.push(attribute);
            }
        }
        return attributes;
    }

    clearFilters() {
        this.productfinder.resetSearchFilters();
    }
}