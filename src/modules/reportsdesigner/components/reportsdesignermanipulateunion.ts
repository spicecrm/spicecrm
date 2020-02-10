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
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignermanipulateunion.html',
    styles: ['.cdk-drop-list-dragging {background-color: #ddd !important}']
})
export class ReportsDesignerManipulateUnion {

    /**
    * @input module: {module: string, unionid: string}
    */
    @Input() private module: any = {};
    /**
    * @input currentUnionListFields: object[]
    */
    @Input() protected currentUnionListFields: any[] = [];

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
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
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /**
    * @removePlaceHolderElement
    * @splice listItems add newItem
    * @set listItems
    */
    private onDrop(dragEvent: CdkDragDrop<any>) {
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
    private linkUnionField(unionField, dragField) {
        const rootPath = this.reportsDesignerService.getCurrentPath().indexOf('link') < 0 ? 'unionroot::' : '';
        const unionPath = this.reportsDesignerService.getCurrentPath().replace('root:' , '');
        unionField.unionfieldname = dragField.fieldname;
        unionField.unionfielddisplayname = dragField.label;
        unionField.unionfielddisplaypath = this.reportsDesignerService.getCurrentPath();
        unionField.unionfieldpath = `${rootPath}union${this.module.unionid}:${unionPath}::${dragField.id}`;
        unionField.displaypath = this.reportsDesignerService.getCurrentPath();
        unionField.joinid = this.module.unionid;
    }

    /**
    * @reset unionField union key values
     */
    protected resetUnionField(unionField) {
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
    private unlinkField(fieldId) {
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
    private onDropEntered(dragEvent) {
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
