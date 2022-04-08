/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnChanges, OnDestroy, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {modelutilities} from "../../../services/modelutilities.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-manipulate-union',
    templateUrl: '../templates/reportsdesignermanipulateunion.html',
    styles: ['.cdk-drop-list-dragging {background-color: #ddd !important}']
})
export class ReportsDesignerManipulateUnion {

    /**
    * @input module: {module: string, unionid: string}
    */
    @Input() public module: any = {};
    /**
    * @input currentUnionListFields: object[]
    */
    @Input() public currentUnionListFields: any[] = [];

    constructor(public language: language,
                public modelUtilities: modelutilities,
                public modal: modal,
                public model: model,
                public reportsDesignerService: ReportsDesignerService) {
    }

    /**
    * @return treeCDKDragList: cdkDragList
    */
    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    /**
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.fieldid;
    }

    /**
    * link union field and remove PlaceHolderElement
    */
    public onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer !== dragEvent.container) {
            this.linkUnionField(dragEvent.container.data, dragEvent.item.data);
        }
    }

    /**
    * @set unionField link key values
     * @param unionField: object
     * @param dragField: object
     * @set unionfieldname
     * @set unionfielddisplayname
     * @set unionfielddisplaypath
     * @set unionfieldpath
     * @set displaypath
     * @set joinid
     */
    public linkUnionField(unionField, dragField) {
        const rootPath = this.reportsDesignerService.getCurrentPath().indexOf('link') < 0 ? 'unionroot::' : '';
        const unionPath = this.reportsDesignerService.getCurrentPath().replace('root:' , '');
        unionField.unionfieldname = dragField.name;
        unionField.unionfielddisplayname = dragField.label;
        unionField.unionfielddisplaypath = this.reportsDesignerService.getCurrentPath();
        unionField.unionfieldpath = `${rootPath}union${this.module.unionid}:${unionPath}::${dragField.id}`;
        unionField.displaypath = this.reportsDesignerService.getCurrentPath();
        unionField.joinid = this.module.unionid;
    }

    /**
    * @reset unionField union key values
     */
    public resetUnionField(unionField) {
        unionField.unionfieldname = '';
        unionField.unionfielddisplayname = '';
        unionField.unionfielddisplaypath = '';
        unionField.unionfieldpath = '';
        unionField.displaypath = '';
    }

    /**
    * @param fieldId: string
     * @delete the record with the given index
     */
    public unlinkField(fieldId) {
        this.modal.confirm(this.language.getLabel('LBL_UNLINK'), this.language.getLabel('LBL_UNLINK'))
            .subscribe(response => {
                if (response) {
                    this.currentUnionListFields.some(field => {
                        if (field.fieldid == fieldId) {
                            this.resetUnionField(field);
                            return true;
                        }
                    });
                }
            });
    }

    /**
    * @param dragEvent: CDKDragDrop
     * move the placeholder element inside its container to prevent overflow
     */
    public onDropEntered(dragEvent) {
        const placeholder = dragEvent.item.getPlaceholderElement();
        dragEvent.container.element.nativeElement.removeChild(placeholder);
        placeholder.style.display = 'block';
        placeholder.style.height = 0;
        placeholder.style.width = 0;
        placeholder.style.overflow = 'hidden';
        const placeholderContainer = dragEvent.container.element.nativeElement.querySelectorAll('td[data-cdk-drag-placholder-container]');
        if (placeholderContainer[0]) placeholderContainer[0].insertBefore(placeholder, placeholderContainer[0].firstChild);
    }
}
