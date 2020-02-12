/**
 * @module ModuleReportsDesigner
 */
import {Component, SkipSelf} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from '../services/reportsdesigner.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'reports-designer-integrate-drill',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitemdrilldown.html',
    providers: [model]
})
export class ReportsDesignerIntegrateItemDrilldown {

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
