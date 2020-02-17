/**
 * @module ModuleReportsDesigner
 */
import {Component, Renderer2} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-present-item-pivot',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitempivot.html',
    styles: ['.reports-designer-table-adjust-drag-placeholder .cdk-drag-placeholder {width: max-content; display: block;}']
})
export class ReportsDesignerPresentItemPivot {

    constructor(public language: language,
                public model: model,
                public renderer: Renderer2,
                public reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return pivot: object
     */
    get advancedOptions(): any {
        return this.model.getField('presentation_params').pluginData.advancedOptions;
    }

    /**
     * @return pivot: object
     */
    get pivotRow() {
        return this.model.getField('presentation_params').pluginData.rowData;
    }

    /**
     * @return pivot: object
     */
    get pivotRowName() {
        return !!this.pivotRow ? this.language.getLabel(this.reportsDesignerService.listFields.find(field => field.fieldid == this.pivotRow).name) : '';
    }

    /**
     * @return pivot: object
     */
    get pivotColumns() {
        return this.model.getField('presentation_params').pluginData.columnData;
    }

    /**
     * @return pivot: object
     */
    get pivotValues() {
        return this.model.getField('presentation_params').pluginData.valueData;
    }

    /**
     * @return listfields: object[]
     */
    get availableListFields() {
        return this.reportsDesignerService.listFields.filter(field => {
            return this.pivotRow !== field.fieldid &&
                !this.pivotColumns.some(column => column.fieldid === field.fieldid) &&
                !this.pivotValues.some(value => value.fieldid === field.fieldid);
        });
    }

    public ngOnInit() {
        this.initializePluginData();
    }

    /**
     * initialize the plugin properties
     */
    public initializePluginData() {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData.advancedOptions) {
            presentationParams.pluginData.advancedOptions = {};
        }
        if (!presentationParams.pluginData.columnData) {
            presentationParams.pluginData.columnData = [];
        }
        if (!presentationParams.pluginData.valueData) {
            presentationParams.pluginData.valueData = [];
        }
        if (!presentationParams.pluginData.rowData) {
            presentationParams.pluginData.rowData = '';
        }
    }

    /**
     * reset listFields sort priority as in the list
     * @param dragEvent: CdkDragDrop<any>
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            if (typeof dragEvent.container.data == 'string') {
                this.model.getField('presentation_params').pluginData.rowData = dragEvent.item.data.fieldid;
            } else {
                dragEvent.container.data.push({
                    id: dragEvent.item.data.id,
                    fieldid: dragEvent.item.data.fieldid,
                    name: dragEvent.item.data.name,
                });
            }

        }
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /**
     * delete selected item from list
     * @param arrayName: string
     * @param id: string
     */
    private deleteItem(arrayName, id) {
        const presentationParams = this.model.getField('presentation_params');
        if (arrayName == 'rowData') {
            presentationParams.pluginData.rowData = '';
        } else {
            presentationParams.pluginData[arrayName] = presentationParams.pluginData[arrayName].filter(item => item.id != id);
        }
    }
}
