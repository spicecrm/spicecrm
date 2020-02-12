/**
 * @module ModuleReportsDesigner
 */
import {Component, Renderer2} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray} from "@angular/cdk/drag-drop";
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
        return !!this.pivotRow && this.pivotRow.length > 0 ? this.language.getLabel(this.listFields.find(field => field.fieldid == this.pivotRow).name) : '';
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
    get listFields() {
        return this.reportsDesignerService.listFields;
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

        this.model.setField('presentation_params', presentationParams);
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
                dragEvent.container.data = dragEvent.item.data.fieldid;
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
     * append a placeholder to the dom keep space reserved for the dragged element in its origin
     * @param e: CdkDragExit
     */
    private dropExited(e: CdkDragExit) {
        this.reportsDesignerService.dragPlaceHolderNode = e.item.getRootElement().cloneNode(true);
        this.renderer.setStyle(this.reportsDesignerService.dragPlaceHolderNode, 'display', 'table-row');
        let index = e.container.data.findIndex(item => item.id == e.item.data.id);
        if (index > -1) {
            e.container.element.nativeElement.insertBefore(
                this.reportsDesignerService.dragPlaceHolderNode,
                e.container.element.nativeElement.children[index]
            );
        }
    }

    /**
     * remove PlaceHolder Element
     * @param e: CdkDragEnter
     */
    private dropEnteredDragList(e) {
        this.reportsDesignerService.removePlaceHolderElement(e.container.element.nativeElement);
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
        if (typeof presentationParams.pluginData[arrayName] == 'string') {
            presentationParams.pluginData[arrayName] = '';
        } else {
            presentationParams.pluginData[arrayName] = presentationParams.pluginData[arrayName].filter(item => item.id != id);
        }
        this.model.setField('presentationParams', presentationParams);
    }
}
