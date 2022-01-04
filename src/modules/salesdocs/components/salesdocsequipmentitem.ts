/**
 * @module ModuleSalesDocs
 */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";

// a little bit based on ServiceOrderEquipmentItem

@Component({
    selector: '[salesdocs-equipment-item]',
    templateUrl: "../templates/salesdocsequipmentitem.html",
    providers: [model, view]
})
export class SalesDocsEquipmentItem implements OnInit  {

    /**
     * The service equipment to be displayed.
     */
    @Input() public equipment: any = {};

    /**
     * the SalesDoc model
     */
    @Input() public salesDoc: model;

    /**
     * the view from the parent .. to link the two
     */
    @Input() public parentview: view;

    /**
     * The fieldset ID.
     */
    @Input() public fieldset: string;

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * Event emitter to tell the parent component that the equipment has been selected or unselected.
     */
    @Output() public selectionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor( public metadata: metadata, public language: language, public model: model, public view: view ) { }

    public ngOnInit(): void {
        this.setEquipmentModelData();
        this.viewSubscriptions();
        this.setConfig();
    }

    /**
     * set the model data for the service equipment
     */
    public setEquipmentModelData() {
        this.model.module = 'ServiceEquipments';
        this.model.id = this.equipment.id;
        this.model.setData(this.equipment);
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    public viewSubscriptions() {
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
        if ( this.fieldset ) this.fieldsetItems = this.metadata.getFieldSetItems( this.fieldset );
    }

    /**
     * Change the selection-flag and emit the information to the parent component.
     */
    public changeSelection() {
        this.equipment.selected = !this.equipment.selected;
        if ( this.equipment.selected ) {
            this.salesDoc.addRelatedRecords('serviceequipments', [this.equipment], false );
            if ( this.salesDoc.data.serviceequipments.beans_relations_to_delete ) {
                delete this.salesDoc.data.serviceequipments.beans_relations_to_delete[this.equipment.id];
            }
        } else {
            if ( !this.salesDoc.data.serviceequipments.beans_relations_to_delete ) this.salesDoc.data.serviceequipments.beans_relations_to_delete = {};
            this.salesDoc.removeRelatedRecords('serviceequipments', [this.equipment.id]);
            this.salesDoc.data.serviceequipments.beans_relations_to_delete[this.equipment.id] = this.equipment;
        }
        this.selectionChanged.emit( this.equipment.selected );
    }

}
