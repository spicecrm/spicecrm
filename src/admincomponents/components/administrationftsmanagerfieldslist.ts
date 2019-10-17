/**
 * @module AdminComponentsModule
 */
import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";


@Component({
    selector: 'administration-ftsmanager-fields-list',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfieldslist.html'
})
export class AdministrationFTSManagerFieldsList {

    public links: any[] = [];
    public self: any = {};
    public fields: any[] = [];
    @Input() private dragList: CdkDropList;
    @Input() private dragPlaceHolderNode: Node;
    @Input() private nodePath: string = '';
    @Input() private selectedField: string = '';
    @Output() public selectListField: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dropList', {static: false}) private dropList;

    constructor(private metadata: metadata,
                private language: language,
                private ftsconfiguration: ftsconfiguration,
                private backend: backend,
                private modal: modal,
                private modelutilities: modelutilities) {
    }

    public ngAfterViewInit() {
        window.setTimeout(() => this.ftsconfiguration.fieldsDropList = this.dropList, 100);
    }

    private rightDrop(dragEvent: CdkDragDrop<any>) {
        this.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);
        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            let field = dragEvent.item.data;
            let id = this.modelutilities.generateGuid();
            let newItem = {
                id: id,
                fieldid: id,
                fieldname: field.name,
                indexfieldname: field.name,
                name: field.label,
                path: this.nodePath + '::' + field.id
            };

            this.ftsconfiguration.moduleFtsFields.splice(dragEvent.currentIndex, 0, newItem);
        }
    }

    private removePlaceHolderElement(containerElement) {
        if (this.dragPlaceHolderNode) {
            containerElement.removeChild(this.dragPlaceHolderNode);
            this.dragPlaceHolderNode = undefined;
        }
    }

    /**
     * track by function for the list for performance
     *
     * @param i
     * @param item
     */
    private trackByFn(i, item) {
        return item.id;
    }

    /**
     * deletes the record with the given index
     *
     * @param index index of the row
     */
    private deleteField(index) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.ftsconfiguration.moduleFtsFields.splice(index, 1);
            }
        });
    }

    private handleSelection(fieldId) {
        this.selectListField.emit(fieldId);
    }

    private isSelected(fieldId) {
        return this.selectedField == fieldId;
    }
}

