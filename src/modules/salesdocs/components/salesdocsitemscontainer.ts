/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Injector
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

@Component({
    selector: 'salesdocs-items-container',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemscontainer.html'
})
export class SalesDocsItemsContainer {

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
            total += parseFloat(item.amount_net);
        }
        return total;
    }

    /**
     * getter for total gross value
     */
    get totalgross() {
        let total = 0;
        for (let item of this.items) {
            total += parseFloat(item.amount_gross);
        }
        return total;
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
        itemData.tax_category = 'V20';
        itemData.quantity = 1;
        itemData.itemnr = this.getNextItemNr();
        itemData.itemtype = itemType;

        // add to the bean as well
        if (!this.model.data.salesdocitems) {
            this.model.data.salesdocitems = {
                beans: {}
            };
        }

        this.model.data.salesdocitems.beans[itemData.id] = itemData;

        this.buildItems();

        // this.recalculate();
    }
}
