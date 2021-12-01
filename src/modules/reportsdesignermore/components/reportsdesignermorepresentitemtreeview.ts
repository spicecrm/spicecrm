/**
 * @module ModuleReportsDesignerMore
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "../../../modules/reportsdesigner/components/reportsdesignerpresentitemstandard";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-present-item-tree-view',
    templateUrl: '../templates/reportsdesignermorepresentitemtreeview.html'
})
export class ReportsDesignerMorePresentItemTreeView extends ReportsDesignerPresentItemStandard {

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    /**
     * @return pluginData: object
     */
    get pluginData() {
        return this.model.getField('presentation_params').pluginData;
    }

    /**
     * set pluginData if not set
     * @setField presentation_params
     */
    public initializePluginData(data?) {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData.stopTreeAt) {
            presentationParams.pluginData.stopTreeAt = '';
            this.model.setField('presentation_params', presentationParams);
        }
    }
}
