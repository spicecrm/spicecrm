/**
 * @module ModuleReportsDesignerMore
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "../../reportsdesigner/components/reportsdesignerpresentitemstandard";
import {ReportsDesignerService} from "../../reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-present-item-grouped',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermorepresentitemgrouped.html'
})
export class ReportsDesignerMorePresentItemGrouped extends ReportsDesignerPresentItemStandard {

    public propertiesFieldName: string = 'groupedViewProperties';

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    public ngOnInit() {
        const data = {groupById: ''};
        super.initializePluginData(data);
    }
}
