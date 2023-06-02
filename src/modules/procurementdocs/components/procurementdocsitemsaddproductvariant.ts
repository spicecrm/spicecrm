/**
 * @module ModuleProcurementDocs
 */
import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {procurementdocrecord} from "../services/procurementdocrecord";

@Component({
    selector: 'procurement-docs-items-add-productvariant',
    templateUrl: '../templates/procurementdocsitemsaddproductvariant.html',
})
export class ProcurementDocsItemsAddProductVariant implements AfterViewInit {

    @ViewChild('productselector', {read: ViewContainerRef, static: true}) public productselector: ViewContainerRef;

    @Output() public additem: EventEmitter<any> = new EventEmitter<any>();

    @Input() public items: any[] = [];

    public self: any = undefined;
    public parentitem_id: string = '';

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public procurementdocrecord: procurementdocrecord
    ) {

    }

    public ngAfterViewInit() {
        this.metadata.addComponent('ProductBrowser', this.productselector).subscribe(componentRef => {
            componentRef.instance.selectionchanged.subscribe(product => {
                this.productSelected(product);
            });
        });
    }

    public close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    public onModalEscX() {
        this.close();
    }

    public productSelected(productvariant) {
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
                    let copyrules = this.metadata.getCopyRules("*", 'ProcurementDocItems');
                    for (let copyrule of copyrules) {
                        if (copyrule.tofield && copyrule.fixedvalue) {
                            itemData[copyrule.tofield] = copyrule.fixedvalue;
                        } else if (copyrule.tofield && copyrule.calculatedvalue) {
                            itemData[copyrule.tofield] = productvariant.object.getCalculatedValue(copyrule);
                        }
                    }

                    // apply parent specific copy rules
                    copyrules = this.metadata.getCopyRules('ProductVariants', 'ProcurementDocItems');
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
                    itemData.tax_category = this.procurementdocrecord.getTaxCategory(data.taxcategory);

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
