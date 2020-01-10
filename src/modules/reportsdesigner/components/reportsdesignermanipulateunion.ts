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
export class ReportsDesignerManipulateUnion implements OnChanges, OnDestroy {

    @ViewChild('dropList', {static: false}) private dropList;
    private listItems: any[] = [];
    /*
    * @input module: {module: string, unionid: string}
    */
    @Input() private module: any = {};

    constructor(private language: language,
                private modelUtilities: modelutilities,
                private modal: modal,
                private model: model,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /*
    * @return treeCDKDragList: cdkDragList
    */
    get dragList() {
        return this.reportsDesignerService.treeCDKDragList;
    }

    /*
    * @set dropLists
    * @set listItems
    */
    public ngOnChanges() {
        this.loadListItems();
        this.reportsDesignerService.dropLists = [...this.reportsDesignerService.dropLists, ...this.listItems.map(item => item.fieldid)];
    }

    /*
    * @filter dropLists from this union row dropLists
    */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = this.reportsDesignerService.dropLists.filter(list => typeof list != 'string');
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.fieldid;
    }

    /*
    * @removePlaceHolderElement
    * @splice listItems add newItem
    * @set listItems
    */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer !== dragEvent.container) {
            let dragField = dragEvent.item.data;
            let newItem = this.generateNewItem(dragField, dragEvent.container.data);
            let unionFields = this.model.getField('unionlistfields');
            if (!unionFields || !unionFields.length) unionFields = [];
            unionFields.push(newItem);
            this.model.setField('unionlistfields', unionFields);
            this.listItems = this.listItems.map(item => {
                if (item.fieldid == newItem.fieldid) item = newItem;
                return item;
            });

        }
    }

    /*
     * @set listItems
     */
    private loadListItems() {
        let listFields = this.model.getField('listfields');
        let unionFields = this.model.getField('unionlistfields');
        if (listFields && listFields.length) {
            if (unionFields && unionFields.length) {
                unionFields = unionFields.filter(field => field.joinid == this.module.unionid);
                listFields = listFields.map(listField => {
                    unionFields.some(unionField => {
                        if (unionField.fieldid == listField.fieldid) {
                            listField = unionField;
                            return true;
                        }
                    });
                    if (!listField.unionfielddisplayname) listField.unionfielddisplayname = listField.unionfieldname;
                    return listField;
                });
            }
            this.listItems = listFields;
        }
    }

    /*
     * @param field: object
     * @return newItem: object
     */
    private generateNewItem(dragField, sourceField) {
        return {
            fieldid: sourceField.fieldid,
            joinid: this.module.unionid,
            path: sourceField.path,
            displaypath: this.reportsDesignerService.currentPath,
            unionfieldpath: `unionroot::union-${this.module.unionid}:${this.reportsDesignerService.currentPath}::${dragField.id}`,
            unionfielddisplaypath: this.reportsDesignerService.currentPath,
            unionfieldname: dragField.fieldname,
            unionfielddisplayname: dragField.label,
            name: sourceField.name,
            fixedvalue: '',
            id: sourceField.fieldid
        };
    }

    /*
     * @param fieldId: string
     * @delete the record with the given index
     */
    private deleteField(fieldId) {
        this.modal.confirm(this.language.getLabel('LBL_UNLINK'), this.language.getLabel('LBL_UNLINK'))
            .subscribe(response => {
                if (response) {
                    this.listItems = this.listItems.map(item => {
                        if (item.fieldid == fieldId) {
                            item = this.model.getField('listfields').find(field => field.fieldid == fieldId);
                        }
                        return item;
                    });
                    let unionFields = this.model.getField('unionlistfields');
                    unionFields = unionFields.filter(field => !(field.fieldid == fieldId && field.joinid == this.module.unionid));
                    this.model.setField('unionlistfields', unionFields);
                }
            });
    }

    /*
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
