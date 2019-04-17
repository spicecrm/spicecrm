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