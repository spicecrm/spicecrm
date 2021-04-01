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
    selector: "[serviceorder-effort-item]",
    templateUrl: "./src/modules/servicecomponents/templates/serviceordereffortitem.html",
    providers: [view]
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
        // this.setItemModelData();
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
