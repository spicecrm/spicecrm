/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Injector, OnDestroy,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {Subject, Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {salesdocrecord} from "../services/salesdocrecord";

declare var moment: any;

@Component({
    selector: 'salesdocs-items-container',
    templateUrl: '../templates/salesdocsitemscontainer.html'
})
export class SalesDocsItemsContainer implements OnInit, OnDestroy {

    /**
     * the items on the sales Document
     */
    public items: any[] = [];

    /**
     * for the voucher handling
     */
    public voucher: any = {};

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * the columns to be displayed
     */
    public subscription = new Subscription();

    constructor(
        public userpreferences: userpreferences,
        public injector: Injector,
        public language: language,
        public backend: backend,
        public elementRef: ElementRef,
        public model: model,
        public modal: modal,
        public view: view,
        public configuration: configurationService,
        public metadata: metadata,
        public broadcast: broadcast,
        public salesdocrecord: salesdocrecord
    ) {
        // build in any case if the items had already been passed in
        this.buildItems();

        // add the subscriber
        this.subscription.add(
            this.broadcast.message$.subscribe(msg => {
                    if (msg.messagetype == 'model.save' || msg.messagetype == 'model.loaded' && msg.messagedata.module === this.model.module) {
                        this.buildItems();
                    }
                }
            )
        );

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }

        // subscribe to the record service to build items
        this.salesdocrecord.buildItems$.subscribe(() => {
            this.buildItems();
        })
    }

    /**
     * on the init recalculate
     */
    public ngOnInit() {
        this.recalculate();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
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
     * recalculates the total document
     */
    public recalculate() {
        this.model.setField('amount_net', this.totalnet);
        this.model.setField('amount_gross', this.totalgross);
    }

    /**
     * build the items and render them in the container
     */
    public buildItems(): boolean {
        if (!this.model.data?.salesdocitems) return false;

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

}
