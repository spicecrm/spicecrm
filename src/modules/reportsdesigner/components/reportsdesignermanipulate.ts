/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {modelutilities} from "../../../services/modelutilities.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-manipulate',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignermanipulate.html'
})
export class ReportsDesignerManipulate implements AfterViewInit, OnDestroy {

    @ViewChild('dropList', {static: false}) private dropList;
    private expandedItemId: string = '';

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    set listItems(value) {
        this.model.setField('listfields', JSON.stringify(value));
    }

    get listItems() {
        const fields = this.model.getField('listfields');
        return fields && fields.length > 0 ? JSON.parse(fields) : [];
    }

    public ngAfterViewInit() {
        this.reportsDesignerService.dropLists = this.dropList;
    }

    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
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

    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);
        let listItems = this.listItems.slice();

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(listItems, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            let field = dragEvent.item.data;
            let id = this.modelUtilities.generateGuid();
            let newItem = {
                id: id,
                fieldid: id,
                fieldname: field.name,
                name: field.label,
                path: this.reportsDesignerService.currentPath + '::' + id,
                displaypath: this.reportsDesignerService.currentPath
            };

            listItems.splice(dragEvent.currentIndex, 0, newItem);
        }
        this.listItems = listItems;
    }

    /*
     * @delete the record with the given index
     * @param fieldId: string
     */
    private deleteField(fieldId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                let listItems = this.listItems.slice();
                listItems = listItems.filter(field => field.fieldid != fieldId);
                this.listItems = listItems;
            }
        });
    }

    private setFieldValue(field, value) {
        let listItems = this.listItems.slice();
        listItems.some(item => {
            if (item.fieldid == field.fieldid) {
                item[field] = value;
            }
        });
        this.listItems = listItems;
    }

    private toggleExpand(fieldId) {
        if (!this.reportsDesignerService.expertMode) return;
        this.expandedItemId = fieldId == this.expandedItemId ? null : fieldId;
    }
}
