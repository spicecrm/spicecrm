/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, OnInit, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {modelutilities} from "../../../services/modelutilities.service";
import {ServiceOrderEffortPanel} from "./serviceordereffortpanel";

@Component({
    templateUrl: "./src/modules/servicecomponents/templates/serviceordereffortconfirmationpanel.html"
})
export class ServiceOrderEffortConfirmationPanel extends ServiceOrderEffortPanel implements OnInit {

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public metadata: metadata,
        public view: view,
        public injector: Injector,
        public utils: modelutilities,
    ) {
        super(language, model, modal, metadata, view, injector, utils);
    }


    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ServiceOrderEffortConfirmationPanel', this.model.module);
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.relation_link_name = this.componentconfig.relation_link_name;
        this.product_filter = this.componentconfig.product_filter;
        this.productvariant_filter = this.componentconfig.productvariant_filter;
        this.detail_fieldset = this.componentconfig.detail_fieldset;
    }

    public openAddModal(itemType) {
        this.modal.openModal("ObjectModalModuleLookup", true, this.injector).subscribe(selectModal => {
            selectModal.instance.module = itemType;
            selectModal.instance.multiselect = true;
            selectModal.instance.relateFilter = itemType=="ProductVariants" ? this.productvariant_filter : this.product_filter;
            selectModal.instance.selectedItems.subscribe(items => {

                for (let product of items) {

                    let itemData: any = {};
                    itemData.id = this.utils.generateGuid();
                    itemData.deleted = false;
                    itemData.description = product.description;
                    itemData.parent_id = product.id;
                    itemData.parent_name = product.name;
                    itemData.uom_id = product.base_uom_id;
                    itemData.quantity = 1;
                    itemData.parent_type = this.currentProductType;
                    itemData.itemnr = (this.itemcount + 1) * 10;
                    itemData.confirmadded = true;

                    // set default acl to allow editing
                    itemData.acl = {
                        create: true,
                        edit: true
                    };

                    this.model.addRelatedRecords(this.relation_link_name, [itemData], false);
                }
                this.currentProductType = "";
            });
        });
    }
}
