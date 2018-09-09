import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from '../../../services/metadata.service';


declare var moment: any;

@Component({
    selector: 'product-brwoser-variants',
    templateUrl: './app/modules/products/templates/productbrowservariants.html',
    host:{
        'style' : '{height: 100%}'
    }
})
export class ProductBrowserVariants {

    @ViewChild('variantsheader', {read: ViewContainerRef}) variantsheader: ViewContainerRef;
    @ViewChild('variantscontent', {read: ViewContainerRef}) variantscontent: ViewContainerRef;

    @Output() selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    fieldset: string = '';

    constructor(private metadata: metadata, private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.fieldset = this.metadata.getComponentConfig('ProductBrowserVariants').fieldset;
    }

    get variantsstyle(){
        let rect = this.variantsheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

    get productvariants(){
        return this.productfinder.productvariants;
    }

    get loading(){
        return this.productfinder.loading;
    }

    search(){
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

    onScroll(e) {
        let element = this.variantscontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.productfinder.getMoreProductVariants();
        }
    }

    handleSelection(data){
        this.selectionchanged.emit(data);
    }
}