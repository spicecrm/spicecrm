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
    Component,
    ElementRef,
    Injector,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {currency} from '../../../services/currency.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;

@Component({
    selector: 'salesdocs-items-container',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemscontainer.html'
})
export class SalesDocsItemsContainer implements OnInit{

    /**
     * the items on the sales Document
     */
    private items: any[] = [];

    /**
     * for the voucher handling
     */
    private voucher: any = {};

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    constructor(
        private userpreferences: userpreferences,
        private injector: Injector,
        private language: language,
        private backend: backend,
        private elementRef: ElementRef,
        private model: model,
        private modal: modal,
        private view: view,
        private configuration: configurationService,
        private metadata: metadata
    ) {
        let itemSubscription = this.model.data$.subscribe(data => {
            if (this.buildItems()) {
                if (itemSubscription) itemSubscription.unsubscribe();
            }
        });

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }
    }

    /**
     * on the init recalculate
     */
    public ngOnInit() {
        this.recalculate();
    }

    /**
     * simple helper to get if the view is editing
     */
    get editing() {
        return this.view.isEditMode();
    }

    /**
     * getter for total net value
     */
    get totalnet() {
        let total = 0;
        for (let item of this.items) {
            if (item.deleted != 1) total += parseFloat(item.amount_net);
        }
        return total;
    }

    /**
     * getter for total gross value
     */
    get totalgross() {
        let total = 0;
        for (let item of this.items) {
            if (item.deleted != 1) total += parseFloat(item.amount_gross);
        }
        return total;
    }

    /**
     * returns the number of not deleted items
     */
    get itemcount() {
        return this.items.filter(item => item.deleted != 1).length;
    }

    /**
     * recacluates the total document
     */
    private recalculate() {
        this.model.setField('amount_net', this.totalnet);
        this.model.setField('amount_gross', this.totalgross);
    }

    /**
     * build the items and render them in the container
     */
    private buildItems(): boolean {
        if (!this.model.data.salesdocitems) return false;

        this.items = [];
        for (let itemid in this.model.data.salesdocitems.beans) {
            this.items.push(this.model.data.salesdocitems.beans[itemid]);
        }

        this.items.sort((a, b) => {
            return a.itemnr > b.itemnr ? 1 : -1;
        });

        if (this.model.data.salesvouchers) {
            for (let voucherid in this.model.data.salesvouchers.beans) {
                this.voucher = this.model.data.salesvouchers.beans[voucherid];
            }
        }
        return true;
    }


    /**
     * gets the next item number
     */
    private getNextItemNr() {
        let lastitemnr = 0;
        for (let item of this.items) {
            let thisitemNr = parseInt(item.itemnr, 10);
            if (thisitemNr > lastitemnr) {
                lastitemnr = thisitemNr;
            }
        }

        return lastitemnr + 10;
    }


    /**
     * called to add an Item
     */
    private addItem() {
        this.modal.openModal('SalesDocsItemsAddTypeSelector', true, this.injector).subscribe(addItemModal => {
            addItemModal.instance.itemTypeSelected.subscribe(itemType => {
                if (itemType) {
                    // get the item type data
                    let itemTypes = this.configuration.getData('salesdocitemtypes');
                    let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == itemType);
                    if (itemTypeDetails) {
                        this.modal.openModal(itemTypeDetails.addmodalcomponent, true, this.injector).subscribe(addModal => {
                            // if a filter is set add the filter
                            if (itemTypeDetails.addmodalfilter) {
                                addModal.instance.modulefilter = itemTypeDetails.addmodalfilter;
                            }
                            // subscribe to the add event
                            addModal.instance.additem.subscribe(item => {
                                // add the item
                                this.handleAddItem(item, itemType);
                            });
                        });
                    }
                }
            });
        });
    }

    /**
     * handler to add the item
     * @param itemData
     */
    private handleAddItem(itemData, itemType) {
        itemData.id = this.model.generateGuid();
        itemData.deleted = 0;
        itemData.salesdoc_id = this.model.id;
        // The tax category is temporarily set by a copy rule.
        // So for this time only one specific tax rate per CRM installation is possible.
        // ToDo: Work out a tax rate calculation.
        // itemData.tax_category = 'V20';
        itemData.quantity = 1;
        itemData.itemnr = this.getNextItemNr();
        itemData.itemtype = itemType;
        itemData.date_entered = new moment();
        itemData.date_modified = new moment();
        console.log('itemType',itemType);

        // add to the bean as well
        if (!this.model.data.salesdocitems) {
            this.model.data.salesdocitems = {
                beans: {}
            };
        }

        this.model.data.salesdocitems.beans[itemData.id] = itemData;

        this.buildItems();

    }
}
