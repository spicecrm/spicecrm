/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, Input, SkipSelf, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-integrate-item-target-list',
    templateUrl: '../templates/reportsdesignerintegrateitemtargetlist.html',
    providers: [model]
})
export class ReportsDesignerIntegrateItemTargetList {

    constructor(public language: language, @SkipSelf() public model: model, public prospectListModel: model) {
    }

    /**
     * @return ktargetlistexport: object
     */
    get properties() {
        return this.model.getField('integration_params').ktargetlistexport;
    }

    /**
     * set the properties.targetlist_id and the model data
     * @param value: string
     */
    set targetList(value) {
        if (!value) return;
        const valueArray = value.split('::');
        this.prospectListModel.id = valueArray[0];
        this.prospectListModel.resetData();
        this.prospectListModel.setField('name', valueArray[1]);

        const properties = this.properties;
        properties.targetlist_id = this.prospectListModel.id;
    }

    /**
     * @return targetList: string
     */
    get targetList() {
        return !!this.prospectListModel.getField('name') ? `${this.prospectListModel.id}::${this.prospectListModel.getField('name')}` : '';
    }

    /**
     * initialize the plugin properties
     */
    public ngOnInit() {
        this.initializeProperties();
    }

    /**
     * set the initial plugin properties
     */
    public initializeProperties() {
        this.prospectListModel.module = 'ProspectLists';

        let integrationParams = this.model.getField('integration_params');
        if (!integrationParams.ktargetlistexport) {
            integrationParams.ktargetlistexport = {
                targetlist_id: '',
                targetlist_update_action: '',
                targetlist_create_direct: false
            };
            this.model.setField('integration_params', integrationParams);
        } else if (!!integrationParams.ktargetlistexport.targetlist_id) {
            this.prospectListModel.id = integrationParams.ktargetlistexport.targetlist_id;
            this.prospectListModel.getData();
        }
    }
}
