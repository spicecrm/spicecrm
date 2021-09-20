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
import {model} from '../../../services/model.service';
import {salesdocrecord} from "../services/salesdocrecord";

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddproductvariant.html',
})
export class SalesDocsItemsAddProductVariant implements AfterViewInit {

    @ViewChild('productselector', {read: ViewContainerRef, static: true}) private productselector: ViewContainerRef;

    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    @Input() private items: any[] = [];

    private self: any = undefined;
    private parentitem_id: string = '';

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private salesdocrecord: salesdocrecord
    ) {

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

                    let itemData: any = {
                        acl: {
                            create: true,
                            edit: true
                        }
                    };

                    // get generic copy rules
                    let copyrules = this.metadata.getCopyRules("*", 'SalesDocItems');
                    for (let copyrule of copyrules) {
                        if (copyrule.tofield && copyrule.fixedvalue) {
                            itemData[copyrule.tofield] = copyrule.fixedvalue;
                        } else if (copyrule.tofield && copyrule.calculatedvalue) {
                            itemData[copyrule.tofield] = productvariant.object.getCalculatedValue(copyrule);
                        }
                    }

                    // apply parent specific copy rules
                    copyrules = this.metadata.getCopyRules('ProductVariants', 'SalesDocItems');
                    for (let copyrule of copyrules) {
                        if (copyrule.fromfield && copyrule.tofield) {
                            itemData[copyrule.tofield] = data[copyrule.fromfield];
                        } else if (copyrule.tofield && copyrule.calculatedvalue) {
                            itemData[copyrule.tofield] = productvariant.object.getCalculatedValue(copyrule);
                        } else if (copyrule.tofield && copyrule.fixedvalue) {
                            itemData[copyrule.tofield] = copyrule.fixedvalue;
                        }
                    }

                    // get the tax category
                    itemData.tax_category = this.salesdocrecord.getTaxCategory(data.taxcategory);

                    this.additem.emit(itemData);


                    // destroy the laod modal
                    loadModal.instance.self.destroy();

                    // destroy the modal
                    this.self.destroy();
                });
            });
        }
    }
}
