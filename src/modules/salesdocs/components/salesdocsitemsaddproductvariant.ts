/**
 * @module ModuleSalesDocs
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    Output
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddproductvariant.html'
})
export class SalesDocsItemsAddProductVariant implements AfterViewInit {

    @ViewChild('productselector', {read: ViewContainerRef, static: true}) private productselector: ViewContainerRef;

    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    @Input() private items: any[] = [];

    private self: any = undefined;
    private parentitem_id: string = '';

    constructor(private metadata: metadata, private language: language, private backend: backend, private modal: modal) {

    }

    public ngAfterViewInit() {
        this.metadata.addComponent('ProductBrowser', this.productselector).subscribe(componentRef => {
            componentRef.instance.selectionchanged.subscribe(product => {
                this.productSelected(product);
            });
        });
    }

    private close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    private onModalEscX() {
        this.close();
    }

    private productSelected(productvariant) {
        if (productvariant.type == 'ProductVariant') {
            this.modal.openModal('SystemLoadingModal', false).subscribe(loadModal => {
                productvariant.object.getData(false).subscribe(data => {

                    // compose the items to be added
                    let itemData = {
                        parent_type: 'ProductVariants',
                        parent_id: productvariant.object.id,
                        productvariant_id: productvariant.object.id,
                        parent_name: productvariant.object.getField('name'),
                        productvariant_name: productvariant.object.getField('name'),
                        name: productvariant.object.getField('name'),
                        uom_id: productvariant.object.getField('base_uom_id'),
                        amount_net_per_uom: productvariant.object.getField('std_price'),
                        purchase_price: productvariant.object.getField('purchase_price')
                    }

                    this.additem.emit(itemData);

                    // destroy the laod modal
                    loadModal.instance.self.destroy();

                    // destroy the modal
                    this.self.destroy();
                });
            })

        }
    }
}