/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "./reportsdesignerpresentitemstandard";

@Component({
    selector: 'reports-designer-present-item-tree-view',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemtreeview.html'
})
export class ReportsDesignerPresentItemTreeView extends ReportsDesignerPresentItemStandard {

    constructor(public language: language, public model: model) {
        super(language, model);
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
