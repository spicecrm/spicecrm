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


import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";

@Component({
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, model, modellist],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class SalesDocsItemsAddProduct extends ObjectModalModuleLookup {

    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public model: model, public modellist: modellist, public metadata: metadata) {
        super(language, model, modellist, metadata);

        // set module to Products
        this.module = 'Products';
    }


    public selectItems() {
        // this.selectedItems.emit(this.modellist.getSelectedItems());

        this.self.destroy();
    }

    public clickRow(event, item) {
        this.productSelected(item);

        this.self.destroy();
    }

    private productSelected(product) {


        // compose the items to be added
        let itemData = {
            parent_type: 'Products',
            parent_id: product.id,
            product_id: product.id,
            productgroup_id: product.productgroup_id,
            parent_name: product.name,
            product_name: product.name,
            productgroup_name: product.productgroup_name,
            name: product.name,
            uom_id: product.base_uom_id,
            amount_net_per_uom: product.std_price,
            purchase_price: product.purchase_price
        }

        this.additem.emit(itemData);

        // destroy the modal
        this.self.destroy();
    }

}
