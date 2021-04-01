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
 * @module ModuleReportsDesignerMore
 */
import {Component, SkipSelf} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-integrate-item-drilldown',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermoreintegrateitemdrilldown.html',
    providers: [model]
})
export class ReportsDesignerMoreIntegrateItemDrilldown {

    private expandedId: string = '';

    constructor(private language: language,
                @SkipSelf() private model: model,
                private modal: modal,
                private otherModel: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.reportsDesignerService.listFields;
    }

    get drilldowns() {
        return this.model.getField('integration_params').kpdrilldown;
    }

    /**
     * initialize the plugin properties and set the otherModel module
     */
    public ngOnInit() {
        this.otherModel.module = 'KReports';
        this.initializeProperties();
    }

    /**
     * set the initial plugin properties
     */
    private initializeProperties() {
        const integrationParams = this.model.getField('integration_params');
        if (!integrationParams.kpdrilldown) {
            integrationParams.kpdrilldown = [];
            this.model.setField('integration_params', integrationParams);
        }
    }

    /**
     * generate new drilldown from data
     * @param data
     * @return newDrilldown: object
     */
    private generateDrilldown(data) {
        return {
            linkid: this.reportsDesignerService.generateGuid(),
            reportid: data.id,
            reportname: data.name,
            displayname: '',
            linktype: 'LINK',
            mappingdata: []
        };
    }

    /**
     * generate mapping data for a drilldown
     * @param data
     * @return mappingData: object
     */
    private generateMappingData(data) {
        return {
            id: this.reportsDesignerService.generateGuid(),
            whereid: data.fieldid, // fieldid for the other report
            wherename: data.name,
            operator: 'equals',
            mappedid: '' // fieldid for this report
        };
    }

    /**
     * initialize drilldown mappingData
     * @param drilldown: object
     */
    private initializeDrilldownMapping(drilldown) {
        this.otherModel.resetData();
        this.otherModel.id = drilldown.reportid;
        this.otherModel.getData().subscribe(data => {
            if (!data || !data.whereconditions || data.whereconditions.length == 0) return;
            let mappingData = data.whereconditions.filter(condition => condition.usereditable == 'yes');
            if (!drilldown.mappingdata) {
                drilldown.mappingdata = [];
            } else if (mappingData.length == drilldown.mappingdata.length) return;

            if (drilldown.mappingdata.length > 0) {
                mappingData = mappingData.filter(data => !drilldown.mappingdata.some(d => d.whereid == data.fieldid));
            }
            drilldown.mappingdata = [...drilldown.mappingdata, ...mappingData.map(data => (this.generateMappingData(data)))];
        });
    }

    /**
     * add new drilldown to the kpdrilldown list
     */
    private addDrilldown() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = 'KReports';
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe((items) => {
                if (!items || !items[0]) return;
                const integrationParams = this.model.getField('integration_params');
                integrationParams.kpdrilldown = [...this.drilldowns, this.generateDrilldown(items[0])];
                this.model.setField('integration_params', integrationParams);
            });
        });
    }

    /**
     * delete the drilldown with the given id
     * @param drilldownId: string
     */
    private deleteDrilldown(drilldownId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                const integrationParams = this.model.getField('integration_params');
                integrationParams.kpdrilldown = this.drilldowns.slice().filter(drilldown => drilldown.linkid != drilldownId);
                this.model.setField('integration_params', integrationParams);
            }
        });
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /**
     * initialize the drilldown mapping data and toggle expansion
     * @param drilldown: object
     */
    private toggleExpandMapping(drilldown) {
        this.expandedId = this.expandedId == drilldown.linkid ? '' : drilldown.linkid;
        if (this.expandedId.length > 0) {
            this.initializeDrilldownMapping(drilldown);
        }
    }
}
