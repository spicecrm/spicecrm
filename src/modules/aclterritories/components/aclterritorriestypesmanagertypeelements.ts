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
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


@Component({
    selector: 'aclterritorries-typesmanager-type-elements',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriestypesmanagertypeelements.html',
})
export class ACLTerritorriesTypesmanagerTypeElements implements OnChanges{

    loading: boolean = false;
    @Input() activeType: string = '';
    typeelements: Array<any> = [];

    constructor(private backend: backend, private modal: modal, private language: language) {
    }

    ngOnChanges(){
        this.loadValues();
    }

    loadValues(){
        if(this.activeType != ''){
            this.loading = true;
            this.backend.getRequest('spiceaclterritories/core/orgobjecttypeelements/'+this.activeType).subscribe(typeelements => {
                this.typeelements = typeelements;

                this.typeelements.sort((a, b) => {
                    return a.sequence > b.sequence ? 1 : -1;
                })

                this.loading = false;
            })
        }
    }

    addTypeElement(){
        this.modal.openModal('ACLTerritorriesTypesmanagerTypeelementsAddModal').subscribe(modalRef => {
            let currentelements = [];
            for(let element of this.typeelements){
                currentelements.push(element.spiceaclterritoryelement_id);
            }
            modalRef.instance.currentelements = currentelements;
            modalRef.instance.newelementid.subscribe(newElement => {

                let newtype = {
                    spiceaclterritorytype_id: this.activeType,
                    spiceaclterritoryelement_id: newElement.id,
                    name: newElement.name,
                    sequence: this.typeelements.length
                };

                this.backend.postRequest('spiceaclterritories/core/orgobjecttypeelements', {}, newtype).subscribe(elements => {
                    this.typeelements.push(newtype);
                });

            })
        })
    }

    deleteTypeElement(typeelements){
        this.modal.confirm('Delete Element', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgobjecttypeelements/' + typeelements.spiceaclterritoryelement_id + '/' + typeelements.spiceaclterritorytype_id).subscribe(resp => {
                    this.typeelements.some((element, index) => {
                        if (element.spiceaclterritoryelement_id == typeelements.spiceaclterritoryelement_id && element.spiceaclterritorytype_id == typeelements.spiceaclterritorytype_id) {
                            this.typeelements.splice(index, 1);
                            return true;
                        }
                    });
                });
            }
        });
    }

}