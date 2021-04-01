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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";

// a little bit based on ServiceOrderEquipmentItem

@Component({
    selector: '[salesdocs-equipment-item]',
    templateUrl: "./src/modules/salesdocs/templates/salesdocsequipmentitem.html",
    providers: [model, view]
})
export class SalesDocsEquipmentItem implements OnInit  {

    /**
     * The service equipment to be displayed.
     */
    @Input() private equipment: any = {};

    /**
     * the SalesDoc model
     */
    @Input() private salesDoc: model;

    /**
     * the view from the parent .. to link the two
     */
    @Input() private parentview: view;

    /**
     * The fieldset ID.
     */
    @Input() private fieldset: string;

    /**
     * the columns to be displayed
     */
    private fieldsetItems: any[] = [];

    /**
     * Event emitter to tell the parent component that the equipment has been selected or unselected.
     */
    @Output() private selectionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor( private metadata: metadata, private language: language, private model: model, private view: view ) { }

    public ngOnInit(): void {
        this.setEquipmentModelData();
        this.viewSubscriptions();
        this.setConfig();
    }

    /**
     * set the model data for the service equipment
     */
    private setEquipmentModelData() {
        this.model.module = 'ServiceEquipments';
        this.model.id = this.equipment.id;
        this.model.data = this.model.utils.backendModel2spice( this.model.module, this.equipment );
    }

    /**
     * view mode subscriptions (manage edit/view mode)
     */
    private viewSubscriptions() {
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
    private setConfig() {
        if ( this.fieldset ) this.fieldsetItems = this.metadata.getFieldSetItems( this.fieldset );
    }

    /**
     * Change the selection-flag and emit the information to the parent component.
     */
    private changeSelection() {
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
