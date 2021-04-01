/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

