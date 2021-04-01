/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/


import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";


@Component({
    selector: "[serviceorder-equipment-item]",
    templateUrl: "./src/modules/servicecomponents/templates/serviceorderequipmentitem.html",
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
     @Input() public  relationlinkname: "serviceequipments";

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
    private fieldsetItems: any[] = [];

    /**
     * true if selected
     */
    private is_selected: boolean = false;


    constructor(
        private metadata: metadata,
        private language: language,
        private model: model,
        private view: view
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
        this.model.module = 'ServiceEquipments';
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
    private setConfig() {
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
    private changeSelection() {
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
