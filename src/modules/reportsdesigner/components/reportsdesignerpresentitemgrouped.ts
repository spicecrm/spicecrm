/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "./reportsdesignerpresentitemstandard";

@Component({
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemgrouped.html'
})
export class ReportsDesignerPresentItemGrouped extends ReportsDesignerPresentItemStandard {

    public propertiesFieldName: string = 'groupedViewProperties';

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    public ngOnInit() {
        const data = {groupById: ''};
        super.initializePluginData(data);
    }
}
