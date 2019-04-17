/**
 * @module ModuleACLTerritories
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


@Component({
    selector: 'aclterritorries-elementmanager-element-values',
    templateUrl: './src/modules/aclterritories/templates/aclterritorrieselementmanagerelementvalues.html',
})
export class ACLTerritorriesElementmanagerElementValues implements OnChanges{

    loading: boolean = false;
    @Input() activeElement: string = '';
    elementvalues: Array<any> = [];

    constructor(private backend: backend, private modal: modal, private language: language) {
    }

    ngOnChanges(){
        this.loadValues();
    }

    loadValues(){
        if(this.activeElement != ''){
            this.loading = true;
            this.backend.getRequest('spiceaclterritories/core/orgelementvalues/'+this.activeElement).subscribe(elementvalues => {
                this.elementvalues = elementvalues;

                this.elementvalues.sort((a, b) => {
                    return a.elementdescription > b.elementdescription ? 1 : -1;
                })

                this.loading = false;
            })
        }
    }


    addValue(){
        this.modal.openModal('ACLTerritorriesElementmanagerElementValuesAddModal').subscribe(modalRef => {
            modalRef.instance.newelementvalue.subscribe(newValue => {

                let newElement = {
                    spiceaclterritoryelement_id: this.activeElement,
                    elementdescription: newValue.name,
                    elementvalue: newValue.value,
                };

                this.backend.postRequest('spiceaclterritories/core/orgelementvalues', {}, newElement).subscribe(elements => {
                    this.elementvalues.push(newElement);
                });
            })
        })
    }

    deleteValue(elementvalue){
        this.modal.confirm('Delete Value', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgelementvalues/' + elementvalue.spiceaclterritoryelement_id + '/' + elementvalue.elementvalue).subscribe(resp => {
                    this.elementvalues.some((element, index) => {
                        if (element.spiceaclterritoryelement_id == elementvalue.spiceaclterritoryelement_id && element.elementvalue == elementvalue.elementvalue) {
                            this.elementvalues.splice(index, 1);
                            return true;
                        }
                    });
                });
            }
        });
    }

}