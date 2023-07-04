/**
 * @module ModuleProcurementDocs
 */
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {procurementdocrecord} from '../services/procurementdocrecord';
import {Subscription} from "rxjs";

@Component({
    selector: '[procurement-docs-item-container]',
    templateUrl: '../templates/procurementdocsitemcontainer.html',
    providers: [model, view]
})
export class ProcurementDocsItemContainer implements OnInit, OnDestroy {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;

    /**
     * the procurementdoc model
     */
    @Input() public procurementdoc: any;

    /**
     * emit when the item has been recalculated
     */
    @Output() public recalculated: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * if the item type has a details view
     */
    public hasDetailsView: boolean = false;

    /**
     * holds the subscrptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public elementRef: ElementRef,
        public model: model,
        public userpreferences: userpreferences,
        public view: view,
        public configuration: configurationService,
        public procurementdocrecord: procurementdocrecord
    ) {
        this.view.displayLabels = false;

        // check if the model has changed and recalculate
        this.model.data$.subscribe(data => {
            this.recalculate();
        });

        this.subscriptions.add(
            this.procurementdocrecord.taxchange.subscribe(() => {
                this.redetermineTax();
            })
        );

    }

    public ngOnInit(): void {
        this.model.module = 'ProcurementDocItems';
        this.model.id = this.item.id;
        this.model.setData(this.item);

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
            if (this.view.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                // start editing the ProcurementDoc
                this.procurementdoc.startEdit();
                // set the view to edit mode
                this.parentview.setEditMode();

                // do not display links
                this.view.displayLinks = false;
            }
        });

        // subscribe to document to listen to relevant changes (currency ... etc)
        this.procurementdoc.data$.subscribe(data => {
            if (this.procurementdoc.getField('currency_id') != this.model.getField('currency_id')) {
                this.model.setField('currency_id', this.procurementdoc.getField('currency_id'));
            }
        });

        // determine if we can open details
        let itemTypes = this.configuration.getData('procurementdocitemtypes');
        if (itemTypes) {
            let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.item.itemtype);
            if (itemTypeDetails && itemTypeDetails.detailcomponentset) this.hasDetailsView = true;

            // determine the list fieldset
            if (itemTypeDetails && itemTypeDetails.itemfieldset) {
                this.fieldsetItems = this.metadata.getFieldSetFields(itemTypeDetails.itemfieldset);
            } else {
                let config = this.metadata.getComponentConfig('ProcurementDocsItemsContainer', 'ProcurementDocItems');
                if (config.fieldset) {
                    this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
                }
            }
        }

        // recalculate in any case
        this.recalculate();
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    get editing() {
        return this.view.isEditMode();
    }

    get taxcategories(): any[] {
        return this.configuration.getData('procurementdoctaxcategories');
    }

    /**
     * returns a formatted number
     *
     * @param number
     */
    public formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    public getUOMLabel(item) {
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
    public deleteItem() {
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
    public toggleDetails() {
        this.item.expanded = !this.item.expanded;
    }

    /**
     * triggered when a recalculate of the complete procurementdoc is required
     */
    public recalculate() {
        // do not recalculate in display mode
        if(this.view.getMode() == 'view') return;

        // check that we have values to recalculate otherwise set totals to 0
        if (this.item.quantity && parseFloat(this.item.quantity) && this.item.amount_net_per_uom && parseFloat(this.item.amount_net_per_uom)) {
            if (this.item.gross_priced) {
                this.item.amount_gross = parseFloat(this.item.quantity) * parseFloat(this.item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(this.item.tax_category);

                this.item.amount_net = this.item.amount_gross * 100 / (100 + taxpercentage);
                this.item.tax_amount = this.item.amount_gross - this.item.amount_net;
            } else {
                this.item.amount_net = parseFloat(this.item.quantity) * parseFloat(this.item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(this.item.tax_category);

                this.item.amount_gross = this.item.amount_net * (100 + taxpercentage) / 100;
                this.item.tax_amount = this.item.amount_net * taxpercentage / 100;
            }
        } else {
            this.item.amount_net = 0;
            this.item.amount_gross = 0;
            this.item.tax_amount = 0;
        }

        this.recalculated.emit(true);
    }

    public redetermineTax() {
        // get the tax category
        let new_taxcategory = this.procurementdocrecord.getTaxCategory(this.item.producttaxcategory);
        if (new_taxcategory != this.item.tax_category) {
            this.item.tax_category = new_taxcategory;
            this.recalculate();
        }
    }

    /**
     * gets the tax percentage for a given category
     * @param taxcategory
     */
    public getTaxPercentage(taxcategory) {
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
