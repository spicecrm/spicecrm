import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {productfinder} from '../services/productfinder.service';


declare var moment: any;

@Component({
    selector: 'product-browser',
    templateUrl: './app/modules/products/templates/productbrowser.html',
    providers:[productfinder, model]
})
export class ProductBrowser {

    @ViewChild('productbrowsercontent', {read: ViewContainerRef}) productbrowsercontent: ViewContainerRef;
    @Output() selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private model: model, private navigation: navigation, private productfinder: productfinder) {
        // set theenavigation paradigm


    }

    getContentStyle(){
        return{
            height: 'calc(100vh - ' + this.productbrowsercontent.element.nativeElement.offsetTop  + 'px)'
        }
    }

    get canAddVariant(){
        return this.productfinder.searchfocus.type == 'Product' ? true : false;
    }

    addVariant(){

        let parent = {
            module: 'Products',
            id: this.productfinder.searchfocus.object.id,
            data: this.productfinder.searchfocus.object
        };
        this.model.module='ProductVariants';
        this.model.addModel('', parent);
    }


    selectionChanged(data){
        this.selectionchanged.emit(data);
    }
}