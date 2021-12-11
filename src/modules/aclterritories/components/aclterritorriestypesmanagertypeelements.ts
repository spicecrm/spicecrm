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
    templateUrl: '../templates/aclterritorriestypesmanagertypeelements.html',
})
export class ACLTerritorriesTypesmanagerTypeElements implements OnChanges {

    public loading: boolean = false;
    public typeelements: any[] = [];

    @Input() public activeType: string = '';

    constructor(public backend: backend, public modal: modal, public language: language) {
    }

    public ngOnChanges() {
        this.loadValues();
    }

    public loadValues() {
        if(this.activeType != '') {
            this.loading = true;
            this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes/' + this.activeType + '/elements').subscribe(typeelements => {
                this.typeelements = typeelements;

                this.typeelements.sort((a, b) => {
                    return a.sequence > b.sequence ? 1 : -1;
                });

                this.loading = false;
            });
        }
    }

    public addTypeElement() {
        this.modal.openModal('ACLTerritorriesTypesmanagerTypeelementsAddModal').subscribe(modalRef => {
            let currentelements = [];
            for(let element of this.typeelements) {
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

                this.backend.postRequest('module/SpiceACLTerritories/core/territorytypes/' + this.activeType + '/elements', {}, newtype).subscribe(elements => {
                    this.typeelements.push(newtype);
                });

            });
        });
    }

    public deleteTypeElement(typeelements) {
        this.modal.confirm('Delete Element', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('module/SpiceACLTerritories/core/territorytypes/' + typeelements.spiceaclterritorytype_id + '/elements/' + typeelements.spiceaclterritoryelement_id).subscribe(resp => {
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
