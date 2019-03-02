/**
 * @module ModuleProducts
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Input, Output, OnInit, EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';


/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'product-brwoser-variant',
    templateUrl: './src/modules/products/templates/productbrowservariant.html',
    providers: [model, view]
})
export class ProductBrowserVariant implements OnInit{

    @Input() productvariant: any = {};
    @Output() selectionchanged: EventEmitter<any> = new EventEmitter<any>();
    opened: boolean = false;

    constructor(private metadata: metadata, private model: model, private modelutilities: modelutilities, private view: view, private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.view.isEditable = false;
    }

    ngOnInit(){
        this.model.id = this.productvariant.id;
        this.model.module = 'ProductVariants';
        this.model.data = this.modelutilities.backendModel2spice('ProductVariants', this.productvariant);

    }

    toggleOpen(){
        this.opened = !this.opened;
    }

    get buttonicon(){
        return this.opened ? 'chevronup' : 'chevrondown';
    }

    godetail(){
        // this.model.goDetail();
        this.selectionchanged.emit({
            type: 'ProductVariant',
            object:  this.model
        });
    }

    edit(){
        this.model.edit(true);
    }
}