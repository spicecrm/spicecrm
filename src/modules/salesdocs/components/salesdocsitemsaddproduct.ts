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
    Output, Optional
} from '@angular/core';


import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {layout} from '../../../services/layout.service';
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {modelutilities} from "../../../services/modelutilities.service";
import {salesdocrecord} from "../services/salesdocrecord";

@Component({
    templateUrl: '../../../objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class SalesDocsItemsAddProduct extends ObjectModalModuleLookup {

    @Output() public additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout, @Optional() public salesdocrecord: salesdocrecord) {
        super(language, modellist, metadata, modelutilities, model, layout);

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

    public productSelected(product) {

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
                itemData[copyrule.tofield] = this.model.getCalculatedValue(copyrule);
            }
        }

        // apply parent specific copy rules
        copyrules = this.metadata.getCopyRules('Products', 'SalesDocItems');
        for (let copyrule of copyrules) {
            if (copyrule.fromfield && copyrule.tofield) {
                itemData[copyrule.tofield] = product[copyrule.fromfield];
            } else if (copyrule.tofield && copyrule.calculatedvalue) {
                itemData[copyrule.tofield] = this.model.getCalculatedValue(copyrule);
            } else if (copyrule.tofield && copyrule.fixedvalue) {
                itemData[copyrule.tofield] = copyrule.fixedvalue;
            }
        }

        // get the tax category
        itemData.tax_category = this.salesdocrecord.getTaxCategory(product.taxcategory);

        this.additem.emit(itemData);

        // destroy the modal
        this.self.destroy();
    }

}
