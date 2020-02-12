/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "./reportsdesignerpresentitemstandard";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-present-item-standard-with-preview',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemstandardwithpreview.html'
})
export class ReportsDesignerPresentItemStandardWithPreview extends ReportsDesignerPresentItemStandard {

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
        if (!presentationParams.pluginData.processCount && !presentationParams.pluginData.listEntries && !presentationParams.pluginData.previewId) {
            presentationParams.pluginData = {
                processCount: 'Synchronous',
                listEntries: 25,
                previewId: ''
            };
            this.model.setField('presentation_params', presentationParams);
        }
    }
}
