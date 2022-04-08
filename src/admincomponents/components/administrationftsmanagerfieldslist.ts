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
    templateUrl: '../templates/administrationftsmanagerfieldslist.html'
})
export class AdministrationFTSManagerFieldsList {

    public links: any[] = [];
    public self: any = {};
    public fields: any[] = [];
    @Input() public dragList: CdkDropList;
    @Input() public dragPlaceHolderNode: Node;
    @Input() public nodePath: string = '';
    @Input() public selectedField: string = '';
    @Output() public selectListField: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dropList', {static: false}) public dropList;

    constructor(public metadata: metadata,
                public language: language,
                public ftsconfiguration: ftsconfiguration,
                public backend: backend,
                public modal: modal,
                public modelutilities: modelutilities) {
    }

    public ngAfterViewInit() {
        window.setTimeout(() => this.ftsconfiguration.fieldsDropList = this.dropList, 100);
    }

    public rightDrop(dragEvent: CdkDragDrop<any>) {
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

    public removePlaceHolderElement(containerElement) {
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
    public trackByFn(i, item) {
        return item.id;
    }

    /**
     * deletes the record with the given index
     *
     * @param index index of the row
     */
    public deleteField(index) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.ftsconfiguration.moduleFtsFields.splice(index, 1);
            }
        });
    }

    public handleSelection(fieldId) {
        this.selectListField.emit(fieldId);
    }

    public isSelected(fieldId) {
        return this.selectedField == fieldId;
    }
}

