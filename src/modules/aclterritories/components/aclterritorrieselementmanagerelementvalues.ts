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
export class ACLTerritorriesElementmanagerElementValues implements OnChanges {

    public loading: boolean = false;
    @Input() public activeElement: string = '';
    public elementvalues: any[] = [];

    constructor(private backend: backend, private modal: modal, private language: language) {
    }

    public ngOnChanges() {
        this.loadValues();
    }

    public loadValues() {
        if(this.activeElement != '') {
            this.loading = true;
            this.backend.getRequest('module/SpiceACLTerritories/core/territoryelements/'+this.activeElement+'/values').subscribe(elementvalues => {
                this.elementvalues = elementvalues;

                this.elementvalues.sort((a, b) => {
                    return a.elementdescription > b.elementdescription ? 1 : -1;
                });

                this.loading = false;
            });
        }
    }


    public addValue() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementValuesAddModal').subscribe(modalRef => {
            modalRef.instance.newelementvalue.subscribe(newValue => {

                let newElement = {
                    spiceaclterritoryelement_id: this.activeElement,
                    elementdescription: newValue.name,
                    elementvalue: newValue.value,
                };

                this.backend.postRequest('module/SpiceACLTerritories/core/territoryelements/' + this.activeElement + '/values/' + newElement.elementvalue, {}, newElement).subscribe(elements => {
                    this.elementvalues.push(newElement);
                });
            });
        });
    }

    public deleteValue(elementvalue) {
        this.modal.confirm('Delete Value', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('module/SpiceACLTerritories/core/territoryelements/' + elementvalue.spiceaclterritoryelement_id + '/values/' + elementvalue.elementvalue).subscribe(resp => {
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
