import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {ServiceOrderItemPanel} from "./serviceorderitempanel";

@Component({
    selector: "[serviceorder-item-item]",
    templateUrl: "../templates/serviceorderitemitem.html",
    providers: [model, view]
})
export class ServiceOrderItemItem implements OnInit  {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the serviceorder model
     */
    @Input() public serviceorder: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;

    /**
     * emit when the item has been recalculated
     */
     @Output() public childview: EventEmitter<string> = new EventEmitter<string>();

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public model: model,
        public view: view
    ) {
    }

    public ngOnInit(): void {
        this.setItemModelData();
        this.viewSubscriptions();
        this.setConfig();
    }

    /**
     * set the model data for the item
     */
    public setItemModelData() {
        this.model.module = 'ServiceOrderItems';
        this.model.id = this.item.id;
        this.model.setData(this.item);
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    public viewSubscriptions() {
        // link the two views

        this.view.displayLabels = false;

        this.view.isEditable = this.parentview.isEditable;
        this.view.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.parentview.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                this.parentview.setEditMode();
                this.parentview.displayLinks = false;
            }
        });
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
    }

    /**
     * set the configuration
     */
    public setConfig() {
        let config = this.metadata.getComponentConfig('ServiceOrderItemPanel', this.serviceorder.module);
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetItems(config.fieldset);
        }
    }

    /**
     * returns true if we are in edit mode
     */
    get editing() {
        return this.view.isEditMode();
    }

    /**
     * marks the item as deleted
     */
    public deleteItem() {
        this.item.deleted = true;
    }
}
