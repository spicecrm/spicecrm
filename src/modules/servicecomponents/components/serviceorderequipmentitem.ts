
import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";


@Component({
    selector: "[serviceorder-equipment-item]",
    templateUrl: "../templates/serviceorderequipmentitem.html",
    providers: [model, view]
})
export class ServiceOrderEquipmentItem implements OnInit  {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the relation_link_name
     */
     @Input() public  relationlinkname = "serviceequipments";

    /**
     * the serviceorder model
     */
    @Input() public serviceorder: model;

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;


    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * true if selected
     */
    public is_selected: boolean = false;


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
        this.model.module = 'ServiceEquipments';
        this.model.id = this.item.id;
        this.model.setData(this.item);
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    public viewSubscriptions() {
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
        let config = this.metadata.getComponentConfig('ServiceOrderEquipmentPanel', this.serviceorder.module);
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetItems(config.fieldset);
        }
        this.is_selected = this.item.selected;
    }



    /**
     * returns true if we are in edit mode
     */
    get editing() {
        return this.view.isEditMode();
    }


    /**
     * change selection-flag and emit the information to the parent
     */
    public changeSelection() {
        this.item.selected = !this.item.selected;
        if(this.item.selected) {
            this.serviceorder.addRelatedRecords(this.relationlinkname, [this.item], false);
            if(this.serviceorder.data[this.relationlinkname]) {
                if (this.serviceorder.data[this.relationlinkname].beans_relations_to_delete) {
                    if (this.serviceorder.data[this.relationlinkname].beans_relations_to_delete[this.item.id]) {
                        delete this.serviceorder.data[this.relationlinkname].beans_relations_to_delete[this.item.id];
                    }
                }
            }
        } else {
            this.serviceorder.removeRelatedRecords(this.relationlinkname, [this.item.id]);
            this.serviceorder.data[this.relationlinkname].beans_relations_to_delete[this.item.id] = this.item;
        }
    }

}
