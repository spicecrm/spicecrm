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
 * @module ModuleACLTerritories
 */
import {
    Component,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigationtab} from '../../../services/navigationtab.service';

@Component({
    selector: 'aclterritorries-elementmanager-elements',
    templateUrl: './src/modules/aclterritories/templates/aclterritorrieselementmanagerelements.html',
})
export class ACLTerritorriesElementmanagerElements {

    private loading: boolean = false;
    private elements: any[] = [];
    private _selectedElement: any = {};
    @Output() private selectedElement: EventEmitter<any> = new EventEmitter<any>();

    constructor(private navigationtab: navigationtab, private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadElements();

        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    private setTabTitle() {
        this.navigationtab.setTabInfo({displayicon: 'settings', displayname: this.language.getLabel('LBL_TERRITORY_ELEMENTS')});
    }

    /**
     * loads the elements
     */
    private loadElements() {
        this.loading = true;
        this.backend.getRequest('spiceaclterritories/core/orgelements').subscribe(elements => {
            this.elements = elements;

            this.elements.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            this.loading = false;
        });
    }

    private selectElement(element) {
        this._selectedElement = element;
        this.selectedElement.emit(element.id);
    }

    private deleteElement(element) {
        this.modal.confirm('Delete Element', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgelements/' + element.id).subscribe(success => {
                    this.elements.some((thiselement, index) => {
                        if (thiselement.id == element.id) {
                            this.elements.splice(index, 1);
                            this.selectElement({id: ''});
                            return true;
                        }
                    });
                });
            }
        });
    }

    private addElement() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementsAddModal').subscribe(modalRef => {
            modalRef.instance.newelementname.subscribe(newName => {

                let newElement = {
                    id: this.modelutilities.generateGuid(),
                    name: newName
                };

                this.backend.postRequest('spiceaclterritories/core/orgelements/' + newElement.id, {}, newElement).subscribe(elements => {
                    this.elements.push(newElement);
                    this.selectElement(newElement);
                });
            });
        });
    }
}
