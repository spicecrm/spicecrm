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
    ElementRef, EventEmitter,
    Input, OnInit, Output
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: '[salesdocs-item-container]',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemcontainer.html',
    providers: [model, view]
})
export class SalesDocsItemContainer implements OnInit {

    /**
     * the item to be displayed
     */
    @Input() private item: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() private parentview: view;

    /**
     * the salesdoc model
     */
    @Input() private salesdoc: any;

    /**
     * emit when the item has been recalculated
     */
    @Output() private recalculated: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    /**
     * if the item type has a details view
     */
    private hasDetailsView: boolean = false;

    constructor(private metadata: metadata, private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private userpreferences: userpreferences, private view: view, private configuration: configurationService) {
        this.view.displayLabels = false;

        // check if the model has changed and recalculate
        this.model.data$.subscribe(data => {
            this.recalculate();
        });


    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item);

        // link the two views
        this.view.isEditable = this.parentview.isEditable;
        this.parentview.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.view.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                this.view.setEditMode();
                this.view.displayLinks = false;
            } else {
                this.view.setViewMode();
                this.view.displayLinks = true;
            }
        });

        this.view.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.parentview.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                // start editing the Salesdoc
                this.salesdoc.startEdit();
                // set the view to edit mode
                this.parentview.setEditMode();

                // do not display links
                this.view.displayLinks = false;
            }
        });

        // subscribe to document to listen to relevant changes (currency ... etc)
        this.salesdoc.data$.subscribe(data => {
            if (this.salesdoc.getField('currency_id') != this.model.getField('currency_id')) {
                this.model.setField('currency_id', this.salesdoc.getField('currency_id'));
            }
        });

        // determine if we can open details
        let itemTypes = this.configuration.getData('salesdocitemtypes');
        if(itemTypes){
            let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.item.itemtype);
            if (itemTypeDetails && itemTypeDetails.detailcomponentset) this.hasDetailsView = true;

            // determine the list fieldset
            if (itemTypeDetails && itemTypeDetails.itemfieldset) {
                this.fieldsetItems = this.metadata.getFieldSetFields(itemTypeDetails.itemfieldset);
            } else {
                let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
                if (config.fieldset) {
                    this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
                }
            }
        }

        // recalculate in any case
        this.recalculate();
    }

    get editing() {
        return this.view.isEditMode();
    }

    get taxcategories(): any[] {
        return this.configuration.getData('salesdoctaxcategories');
    }

    /**
     * returns a formatted number
     *
     * @param number
     */
    private formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    private getUOMLabel(item) {
        let uoms = this.configuration.getData('uomunits');
        let unit = uoms.find(uom => uom.id == item.uom_id);
        if (unit) {
            return this.language.getLabel(unit.label);
        } else {
            return item.uom_id;
        }
    }

    /**
     * marks the item as deleted
     */
    private deleteItem() {
        this.item.deleted = 1;
    }

    /**
     * getter for the icon of the exoanded section
     *
     * ToDo: change to animation
     */
    get toggleIcon() {
        return this.item.expanded ? 'chevronup' : 'chevrondown';
    }

    /**
     * toggels the expanded flag and shows the details or hides them
     */
    private toggleDetails() {
        this.item.expanded = !this.item.expanded;
    }

    /**
     * triggered when a recalculate of the complete salesdoc is required
     */
    private recalculate() {
        if (this.item.quantity && parseFloat(this.item.quantity) && this.item.amount_net_per_uom && parseFloat(this.item.amount_net_per_uom)) {
            this.item.amount_net = parseFloat(this.item.quantity) * parseFloat(this.item.amount_net_per_uom);

            let taxpercentage = this.getTaxPercentage(this.item.tax_category);

            this.item.amount_gross = this.item.amount_net * (100 + taxpercentage) / 100;
            this.item.tax_amount = this.item.amount_net * taxpercentage / 100;
        } else {
            this.item.amount_net = 0;
            this.item.amount_gross = 0;
            this.item.tax_amount = 0;
        }

        this.recalculated.emit(true);
    }

    /**
     * gets the tax percentage for a given category
     * @param taxcategory
     */
    private getTaxPercentage(taxcategory) {
        let taxpercentage = 0;

        this.taxcategories.some(record => {
            if (record.taxcategoryid == taxcategory) {
                taxpercentage = parseInt(record.taxpercentage, 10);
                return true;
            }
        });

        return taxpercentage;
    }


}
