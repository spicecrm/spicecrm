import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {Router} from "@angular/router";


declare var moment: any;

@Component({
    templateUrl: './src/modules/products/templates/productmanager.html',
    providers:[model]
})
export class ProductManager {

    @ViewChild('productmanagercontent', {read: ViewContainerRef}) productmanagercontent: ViewContainerRef;

    selectedItem: any = {};

    constructor(private language: language, private model: model, private navigation: navigation, private router: Router) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Products');

    }

    getContentStyle(){
        return{
            height: 'calc(100vh - ' + this.productmanagercontent.element.nativeElement.offsetTop  + 'px)'
        }
    }

    get canAddVariant(){
        return this.selectedItem.type === 'Product';
    }

    addVariant(){
        let parent = {
            module: 'Products',
            id: this.selectedItem.object.id,
            data: this.selectedItem.object
        };
        this.model.module='ProductVariants';
        this.model.addModel('', parent);
    }

    selectionChanged(data){
        if(data.object) {
            data.object.goDetail();
        }
    }
}