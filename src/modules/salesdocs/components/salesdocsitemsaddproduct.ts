import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnChanges, OnInit, EventEmitter, OnDestroy, Output
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'salesdocs-items-addproduct',
    templateUrl: './app/modules/salesdocs/templates/salesdocsitemsaddproduct.html'
})
export class SalesDocsItemsAddProduct implements AfterViewInit{

    @ViewChild('productselector', {read: ViewContainerRef}) productselector: ViewContainerRef;
    @Output() addproduct: EventEmitter<any> = new EventEmitter<any>();
    @Input()items: Array<any> = [];

    self: any = undefined;
    parentitem_id: string = '';

    constructor(private metadata: metadata, private language: language, private backend: backend, private modal: modal) {

    }

    ngAfterViewInit(){
            this.metadata.addComponent('ProductBrowser', this.productselector).subscribe(componentRef => {
                componentRef.instance.selectionchanged.subscribe(product => {
                    this.productSelected(product);
                });
            });
    }

    close(){
        // emit the value
        this.addproduct.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    onModalEscX() {
        this.close();
    }

    productSelected(product){
        if(product.type == 'ProductVariant'){


            this.modal.openModal('SystemLoadingModal', false ).subscribe(loadModal => {
                product.object.getData(false).subscribe(data => {
                    this.addproduct.emit({product: product, parentitem_id: this.parentitem_id});

                    // destroy the laod modal
                    loadModal.instance.self.destroy();

                    // destroy the modal
                    this.self.destroy();
                });
            })

        }
    }
}