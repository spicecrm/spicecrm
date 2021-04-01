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
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'aclterritorries-typesmanager-types',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriestypesmanagertypes.html',
})
export class AclterritorriesTypesmanagerTypes {

    loading: boolean = false;
    types: Array<any> = [];
    _selectedType: any = {};
    @Output() selectedType: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadElements();
    }

    loadElements() {
        this.loading = true;
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes').subscribe(types => {
            this.loading = false;
            this.types = types;

            this.types.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            })
        })
    }

    selectType(type) {
        this._selectedType = type;
        this.selectedType.emit(type.id);
    }

    deleteType(type) {
        this.modal.confirm('Delete Type', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgobjecttypes/' + type.id).subscribe(success => {
                    this.types.some((element, index) => {
                        if (element.id == type.id) {
                            this.types.splice(index, 1);

                            if (this._selectedType.id == element.id) {
                                this._selectedType = undefined;
                                this.selectType('');
                            }

                            return true;
                        }
                    })
                })
            }
        });
    }

    addType() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementsAddModal').subscribe(modalRef => {
            modalRef.instance.newelementname.subscribe(newName => {

                let newType = {
                    id: this.modelutilities.generateGuid(),
                    name: newName
                };

                this.backend.postRequest('spiceaclterritories/core/orgobjecttypes/' + newType.id, {}, newType).subscribe(elements => {
                    this.types.push(newType);
                    this.selectType(newType);
                });
            })
        })
    }
}