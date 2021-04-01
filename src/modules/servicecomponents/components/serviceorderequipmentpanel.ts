/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, OnInit, Injector, ChangeDetectorRef, OnDestroy, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {modelutilities} from "../../../services/modelutilities.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: "serviceorder-equipment-panel",
    templateUrl: "./src/modules/servicecomponents/templates/serviceorderequipmentpanel.html",
    providers: [relatedmodels, modellist]
})
export class ServiceOrderEquipmentPanel implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * the used fieldsets
     */
    public fieldset: string = "";

    /**
     * the used relation name
     */
    public relation_link_name: string = "";

    /**
     * the used filter
     */
    public equipmentfilter: string = "";

    /**
     * the columns to be displayed
     */
    private fieldsetFields: any[] = [];

    /**
     * all selected items
     */
    private selected_items: any[] = [];

    /**
     * list of all ServiceEquipmentItems
     */
    private all_items: any = {};

    /**
     * sortfield
     */
    private sortField: string = 'date_entered';

    /**
     * subscription to the model data
     */
    private subscription: any;

    /**
     * to recognize the change of the servicelocation (to load the new equipments)
     */
    private servicelocationId: string = '';

    /**
     * the used fieldsets
     */
    public currentProductType: string = "";

    constructor(
        private language: language,
        @SkipSelf() public parent: model,
        private model: model,
        private modal: modal,
        private metadata: metadata,
        private view: view,
        private injector: Injector,
        public utils: modelutilities,
        public relatedmodels: relatedmodels,
        private modellist: modellist,
        public cdRef: ChangeDetectorRef
    ) {

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ServiceOrderEquipmentPanel', this.model.module);

        this.servicelocationId = this.model.getField("servicelocation_id");
        this.subscription = this.model.data$.subscribe(
            res => {
                if(res.servicelocation_id == "" || !res.servicelocation_id) {
                    this.clearAllSelectedItems();
                }
                if(res.servicelocation_id != this.servicelocationId) {
                    this.servicelocationId = res.servicelocation_id;
                    if(this.servicelocationId != "" && this.servicelocationId) this.setAllItems();
                }
            }
        );

    }
    public ngOnInit() {
        this.setComponentConfig();
        this.getFieldsetFields();
        if(this.servicelocationId != "" && this.servicelocationId)this.setAllItems();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.relation_link_name = this.componentconfig.relation_link_name;
        this.equipmentfilter = this.componentconfig.equipmentfilter;
    }
    /*
    * get the fieldsetfields
    */
    public getFieldsetFields() {
        if (this.componentconfig.fieldset) {
            this.fieldsetFields = this.metadata.getFieldSetFields(this.fieldset);
            this.fieldsetFields.shift();
        }
    }


    /**
     * build the items and render them in the container
     */
    private setAllItems() {
        this.all_items = {};
        this.modellist.setModule("ServiceEquipments");
        if (this.sortField) {
            this.modellist.setSortField(this.sortField, "DESC", false);
        }

        // if we don't have a serviceorder id, we give the servicelocation directly to the filter
        // when we change the servicelocation we need both information in the backend 'serviceorder' for old relations and 'servicelocation' for possible relations
        if(!this.model.isNew)  {
            this.modellist.filtercontextbeanid = JSON.stringify({ serviceorder_id: this.model.id, servicelocation_id: this.model.data.servicelocation_id });
        } else {
            this.modellist.filtercontextbeanid = JSON.stringify({ serviceorder_id: '', servicelocation_id: this.servicelocationId });
        }

        this.modellist.modulefilter = this.equipmentfilter;
        let requestedFields = ['name', 'servicelocation_name'];

        this.modellist.getListData(requestedFields).subscribe(data => {
            if(data) {
                let all_items = this.modellist.listData;
                this.setSelectedItems(all_items);
            }
        });
    }

    /**
     * returns the number of not deleted items
     */
    private setSelectedItems(all_items) {
        this.selected_items = this.model.getRelatedRecords(this.relation_link_name);
        // if we come from a ServiceEquipment -> set it as selected
        if(this.model?.parentmodel?.module == 'ServiceEquipments') {
            this.selected_items.push(this.model.parentmodel);
        }

        for (let aitem of all_items.list) {
            aitem.selected = false;
            for (let sitem of this.selected_items) {
                if(aitem.id == sitem.id) {
                    aitem.selected = true;
                }
            }
        }
        this.all_items = all_items;
    }

    /**
     * clearAllRelationships to the equipments (location changed!) and delete all equipments
     */
    private clearAllSelectedItems() {
        this.all_items.list = this.all_items?.list?.filter(item => item?.selected);
    }


    /**
     * returns current items with the selected info
     */
    get items() {
        this.setSelectedItems(this.all_items);
        return this.all_items;
    }

    /**
     * returns the number of not deleted items
     */
    get itemcount() {
        if (this.all_items?.list) {
            let items = this.all_items.list.filter(item => item.deleted != 1);
            if (items) {
                return items.length;
            }
        } else {
            return 0;
        }
    }

    /**
     * returns true if we are in edit mode
     */
    get editing() {
        return this.view.isEditMode();
    }

    /*
 * @sort items by sortField: moment.date
 * @return items: any[]
 */
    private sortItems(items) {
        return items.sort((a, b) => a[this.sortField] && b[this.sortField] ? a[this.sortField] > b[this.sortField] ? 1 : -1 : 0);
    }

}
