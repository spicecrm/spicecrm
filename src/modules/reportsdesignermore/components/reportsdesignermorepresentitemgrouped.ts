/**
 * @module ModuleReportsDesignerMore
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {ReportsDesignerPresentItemStandard} from "../../../modules/reportsdesigner/components/reportsdesignerpresentitemstandard";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-more-present-item-grouped',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermorepresentitemgrouped.html'
})
export class ReportsDesignerMorePresentItemGrouped extends ReportsDesignerPresentItemStandard {

    public propertiesFieldName: string = 'groupedViewProperties';

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
        super(language, model, reportsDesignerService);
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.reportsDesignerService.listFields;
    }

    public ngOnInit() {
        const data = {groupById: ''};
        super.initializePluginData(data);
    }

    /**
     * @moveItemInArray item in group.conditions
     * @set listfield.sortpriority
     * @set listfields
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        dragEvent.container.data = dragEvent.container.data.map((item, index) => {
            item.sortpriority = index;
            return item;
        });
        this.model.setField('listfields', dragEvent.container.data);
    }

    /**
     * @set field.link: string
     */
    protected setFieldLink(field, value) {
        field.link = value ? 'yes' : 'no';
    }
}
