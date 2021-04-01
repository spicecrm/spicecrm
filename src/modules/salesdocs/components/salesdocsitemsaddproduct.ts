/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
import {layout} from '../../../services/layout.service';
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class SalesDocsItemsAddProduct extends ObjectModalModuleLookup {

    @Output() public additem: EventEmitter<any> = new EventEmitter<any>();


    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout) {
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

    private productSelected(product) {

        let itemData = {
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
                itemData[copyrule.tofield] = this.model.getCalculatedValue(copyrule.calculatedvalue);
            }
        }

        // apply parent specific copy rules
        copyrules = this.metadata.getCopyRules('Products', 'SalesDocItems');
        for (let copyrule of copyrules) {
            if (copyrule.fromfield && copyrule.tofield) {
                itemData[copyrule.tofield] = product[copyrule.fromfield];
            } else if (copyrule.tofield && copyrule.calculatedvalue) {
                itemData[copyrule.tofield] = this.model.getCalculatedValue(copyrule.calculatedvalue);
            } else if (copyrule.tofield && copyrule.fixedvalue) {
                itemData[copyrule.tofield] = copyrule.fixedvalue;
            }
        }

        // ompose the items to be added
        /*
        itemData = {
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
         */

        this.additem.emit(itemData);

        // destroy the modal
        this.self.destroy();
    }

}
