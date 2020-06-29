import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: "[serviceorder-effort-item]",
    templateUrl: "./src/modules/servicecomponents/templates/serviceordereffortitem.html",
    providers: [model, view]
})
export class ServiceOrderEffortItem implements OnInit  {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the relation_link_name
     */
    @Input() public  relationlinkname: "serviceorderefforts";

    /**
     * the serviceorder model
     */
    @Input() public serviceorder: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;

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
    private setItemModelData() {
        this.model.module = 'ServiceOrderEfforts';
        this.model.id = this.item.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.item);
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    private viewSubscriptions() {
        this.view.displayLabels = false;
        // link the two views
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
        let config = this.metadata.getComponentConfig('ServiceOrderEffortPanel', this.serviceorder.module);
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
    private deleteItem() {
        this.serviceorder.removeRelatedRecords(this.relationlinkname, [this.item.id]);
        this.serviceorder.data[this.relationlinkname].beans_relations_to_delete[this.item.id] = this.item;

        // this.item.deleted = true;
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

}
